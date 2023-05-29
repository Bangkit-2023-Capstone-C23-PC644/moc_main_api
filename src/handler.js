const { query } = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const pool = mysql.createPool({
    host: '172.27.213.253',
    user: 'wsl_root',
    password: 'password',
    database: 'mocset',
    connectionLimit: 10, // Adjust the limit as per your requirements
});


const getHospitalHandler = async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
    
        // Execute the SQL query asynchronously
        const [rows, fields] = await connection.query('SELECT namaRS FROM hospitals');
    
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
        
        const query = "SELECT h.namaRS, h.alamat, h.kemampuan_penyelenggaraan, h.status_akreditasi, h.jumlah_tempat_tidur_perawatan_persalinan, h.jml_dokter_umum, h.jml_dokter_gigi, jml_perawat, jml_bidan, jml_ahli_gizi, s.status, s.timeadded FROM hospitals h JOIN activity s ON h.hospitalId = s.hid WHERE h.hospitalId = ? AND s.timeadded = (SELECT MAX(timeadded) FROM activity WHERE hospitalId = ?)";
        // Execute the SQL query asynchronously
        const [rows, fields] = await connection.query(query, [id, id]);
    
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

const registerHandler = async (req,res) => {
    const {nik, name, email, phone, password, lintang, bujur} = req.body;
    if (!nik || !name || !email || !phone || !password || !lintang || !bujur) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if (nik === '' || name === ''|| email === ''|| !phone === '' || !password === ''|| !lintang === '' || !bujur === '') {
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
    const query = 'SELECT password FROM users WHERE nik=?'
    const [rows, fields] = await connection.query(query, [nik, password]);
    connection.release();
    if(rows.length !== 0){
        const auth = bcrypt.compareSync(password, rows[0].password)
        if (auth){
            const payload = {nik: nik}
            const token = jwt.sign(payload, 'a');
            return res.status(200).json({token});
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
        const query = 'SELECT t1.hospitalID, t1.namaRS, ST_Distance_Sphere(t1.location, POINT(t2.bujur, t2.lintang)) AS distance FROM hospitals t1 JOIN users t2 ON t2.nik = ? ORDER BY distance;'
        const [rows, fields] = await connection.query(query, [nik]);
    
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

const helloHandler = (req,res) => {
    res.status(200).send({
        hello: 'okay'
    })
}


module.exports= { helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler, getNearestTokenHandler, getHospitalSpecificHandler };
