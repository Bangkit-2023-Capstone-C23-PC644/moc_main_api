require('dotenv').config();
const { query } = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
    connectionLimit: 10, // Adjust the limit as per your requirements
});


const getHospitalHandler = async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
    
        // Execute the SQL query asynchronously
        const [rows, fields] = await connection.query('SELECT hospitalID, namaRS FROM hospitals');
    
        // Release the connection back to the pool
        connection.release();
    
        // Send the query result as a response
        res.json(rows);
      } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
      }
}

const getHospitalSpecificHandler = async (req,res) => {
    const {id} = req.params;
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
        
        const query = "SELECT h.hospitalID, h.namaRS, h.alamat, h.kemampuan_penyelenggaraan, h.status_akreditasi, h.jumlah_tempat_tidur_perawatan_umum, h.jumlah_tempat_tidur_perawatan_persalinan, h.jml_dokter_umum, h.jml_dokter_gigi, h.jml_perawat, h.jml_bidan, h.jml_ahli_gizi, s.status, s.pplestimate, s.timeadded FROM hospitals h JOIN activity s ON h.hospitalID = s.hid WHERE h.hospitalID = ? AND s.timeadded = (SELECT MAX(timeadded) FROM activity WHERE hid = ?)";
        // Execute the SQL query asynchronously
        const [rows, fields] = await connection.query(query, [id, id]);
    
        // Release the connection back to the pool
        connection.release();
    
        // Send the query result as a response
        res.json({
            "error":"false",
            "message":"success",
            "result": rows[0]
        });
      } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
      }
}

const registerHandler = async (req,res) => {
    const {nik, name, email, phone, password, lintang, bujur} = req.body;
    if (!nik || !name || !email || !phone || !password || !lintang || !bujur) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if (nik === '' || name === ''|| email === ''|| phone === '' || password === ''|| lintang === '' || bujur === '') {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if(nik.length < 16){
        res.status(400).json({ error: 'NIK invalid' });
        return;
    }

    if(password.length < 6){
        res.status(400).json({ error: 'password harus 6 karakter atau lebih' });
        return;
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password,salt)

    const connection = await pool.getConnection();

    try{
    // Execute the SQL query asynchronously
    const query = 'INSERT INTO users (nik, name, email, phone, password, lintang, bujur) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.query(query, [nik, name, email, phone, hash, lintang, bujur]);

    // Release the connection back to the pool
    connection.release();

    // Send the query result as a response
    res.json({
      id: result.insertId,
      message: 'Data inserted successfully',
    });
    }

    catch (error) {
    // Handle any errors that occur during the process
    console.error('Error inserting data:', error);
    res.status(400).send('duplicate entry detected');
  }
}

const loginHandler = async (req,res) =>{
    const { nik, password } = req.body;
    if(!nik || !password){
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    if (nik === '' || password === '') {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const connection = await pool.getConnection();
    const query = 'SELECT nik, name, email, phone, password, lintang, bujur FROM users WHERE nik=?'
    const [rows, fields] = await connection.query(query, [nik]);
    connection.release();
    if(rows.length !== 0){
        const auth = bcrypt.compareSync(password, rows[0].password)
        if (auth){
            const payload = {nik: nik}
            const token = jwt.sign(payload, process.env.SECRET_USER);
            return res.status(200).json({
                "error" : "false",
                "message" : "success",
                "loginResult": {
                    "nik": rows[0].nik,
                    "name": rows[0].name,
                    "email":rows[0].email,
                    "phone":rows[0].phone,
                    "lintang":rows[0].lintang,
                    "bujur":rows[0].bujur,
                    "token":token
                }
            });
        }
        return res.status(400).json({error: 'wrong password'});
    }
    res.status(400).json({error:'nik not found'})
}

const getShortestHandler = async (req,res) => {
    const {longitude , latitude} = req.body;
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
    
        // Execute the SQL query asynchronously
        const query = 'SELECT hospitalID, namaRS, ST_Distance_Sphere(location, POINT(?, ?)) AS distance FROM hospitals ORDER BY distance;'
        const [rows, fields] = await connection.query(query, [longitude, latitude]);
    
        // Release the connection back to the pool
        connection.release();
    
        // Send the query result as a response
        res.json(rows);
      } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
      }
}

const getNearestTokenHandler = async(req,res) =>{
    const nik = req.nik;
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
    
        // Execute the SQL query asynchronously
        const query = 'SELECT t1.hospitalID, t1.namaRS, t1.lintang, t1.bujur, ST_Distance_Sphere(t1.location, POINT(t2.bujur, t2.lintang)) AS distance FROM hospitals t1 JOIN users t2 ON t2.nik = ? ORDER BY distance;'
        const [rows, fields] = await connection.query(query, [nik]);
    
        // Release the connection back to the pool
        connection.release();
    
        // Send the query result as a response
        res.json({
            "error": "false",
            "message":"success",
            "result": rows
        });
      } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
      }
}

const rsRegisterHandler = async (req,res) => {
    const { hospitalID, namaRS, alamat, lintang, bujur, kemampuan_penyelenggaraan, status_akreditasi, jumlah_tempat_tidur_perawatan_umum, jumlah_tempat_tidur_perawatan_persalinan, jml_dokter_umum, jml_dokter_gigi, jml_perawat, jml_bidan, jml_ahli_gizi, password } = req.body;

    const default_kemampuan_penyelenggaraan = kemampuan_penyelenggaraan || 0;
    const default_status_akreditasi = status_akreditasi || 0;
    const default_jumlah_tempat_tidur_perawatan_umum = jumlah_tempat_tidur_perawatan_umum || 0;
    const default_jumlah_tempat_tidur_perawatan_persalinan = jumlah_tempat_tidur_perawatan_persalinan || 0;
    const default_jml_dokter_umum = jml_dokter_umum || 0;
    const default_jml_dokter_gigi = jml_dokter_gigi || 0;
    const default_jml_perawat = jml_perawat || 0;
    const default_jml_bidan = jml_bidan || 0;
    const default_jml_ahli_gizi = jml_ahli_gizi || 0;

    if(!hospitalID || !namaRS || !alamat || !lintang || !bujur) {
        console.log(`${hospitalID}, ${namaRS}, ${alamat}, ${lintang}, ${bujur}`);
        res.status(400).json({ error: 'Missing required fields1' });
        return;
    }
    if(hospitalID === ''|| namaRS === '' || alamat === '' || lintang === '' || bujur === '') {
        res.status(400).json({ error: 'Missing required fields2' });
        return;
    }

    if(hospitalID.length < 7 ){
        res.status(400).json({ error: 'ID invalid' });
        return;
    }
    if(password.length < 6){
        res.status(400).json({ error: 'password harus lebih dari 6 karakter' });
        return;
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password,salt)

    const connection = await pool.getConnection();

    try{
    // Execute the SQL query asynchronously
    const query = `INSERT INTO hospitals (hospitalID, namaRS, alamat, lintang, bujur, kemampuan_penyelenggaraan, status_akreditasi, jumlah_tempat_tidur_perawatan_umum, jumlah_tempat_tidur_perawatan_persalinan, jml_dokter_umum, jml_dokter_gigi, jml_perawat, jml_bidan, jml_ahli_gizi, password, location ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, POINT(${bujur} ,${lintang}))`;
    const [result] = await connection.query(query, [hospitalID, namaRS, alamat, lintang, bujur, default_kemampuan_penyelenggaraan, default_status_akreditasi, default_jumlah_tempat_tidur_perawatan_umum, default_jumlah_tempat_tidur_perawatan_persalinan, default_jml_dokter_umum, default_jml_dokter_gigi, default_jml_perawat, default_jml_bidan, default_jml_ahli_gizi, hash]);
    const [result2] = await connection.query('INSERT INTO activity (hid, status, pplestimate, timeadded) VALUES (?, 0, 0, NOW())', [hospitalID])
    // Release the connection back to the pool
    connection.release();

    // Send the query result as a response
    res.json({
      id: result.insertId,
      message: 'Data inserted successfully',
    });
    }

    catch (error) {
    // Handle any errors that occur during the process
    console.error('Error inserting data:', error);
    res.status(400).send('duplicate entry detected');
  }
}

const rsLoginHandler = async (req,res) => {
    const { hospitalID, password } = req.body;

    if(!hospitalID || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if(hospitalID === ''|| password === '') {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const connection = await pool.getConnection();

    try{
    // Execute the SQL query asynchronously
    const query = `SELECT hospitalID, password FROM hospitals WHERE hospitalID = ?`;
    const [result] = await connection.query(query, [hospitalID]);
    // Release the connection back to the pool
    connection.release();

    // Send the query result as a response
    if(result.length === 0){
        res.status(400).json({ error: 'ID tidak terdaftar' });
        return;
    }
    const auth = await bcrypt.compare(password, result[0].password)
    if(!auth){
        res.status(400).json({ error: 'Password salah' });
        return;
    }
    const token = jwt.sign({hospitalID: result[0].hospitalID}, process.env.SECRET_RS)
    res.json({
      token,
      message: 'Login berhasil',
    });
    }

    catch (error) {
    // Handle any errors that occur during the process
    console.error('Error inserting data:', error);
    res.status(400).send('Invalid credentials');
  }
}

const mlhandler = async (req, res)=>{
    const hospitalID = req.hospitalID
    const connection = await pool.getConnection();
    try {
        // Get the image file from the request
        
        const imageFile = req.file;

        const blob = new Blob([imageFile.buffer], { type: imageFile.mimetype });

    
        // Create a new FormData instance
        const formData = new FormData();
        formData.append('file', blob, imageFile.originalname);
    
        // Make a request to the other API resource
        const response = await axios.post(process.env.ML_LINK, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
    
        // Handle the response from the other API resource
        // ...
        const ppl = response.data.estimate
        let status = 0;
        if (ppl > 20){
            status = 3
        }
        else if (ppl > 10 && ppl<20 ){
            status = 2
        }
        else {status = 1}
        const [result2] = await connection.query('INSERT INTO activity (hid, status, pplestimate, timeadded) VALUES (?, ?, ?, NOW())', [hospitalID, status, ppl])
        // Release the connection back to the pool
        connection.release();
        res.status(200).json({
            "ppl": ppl,
            "status": status
        });


      } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      }
}

const helloHandler = (req,res) => {
    res.status(200).send({
        hello: 'okay'
    })
}


module.exports= { helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler, getNearestTokenHandler, getHospitalSpecificHandler, rsRegisterHandler,rsLoginHandler, mlhandler };
