const { query } = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
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
        const [rows, fields] = await connection.query('SELECT namaRS, alamat, rawatInap FROM hospitals');
    
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
            return res.status(200).send('login successful')
        }
        return res.status(400).send('wrong password')
    }
    res.status(400).json('nik not found')
}

const getShortestHandler = async (req,res) => {
    const {longitude , latitude} = req.body;
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
    
        // Execute the SQL query asynchronously
        const query = 'SELECT namaRS, ST_Distance_Sphere(location, POINT(?, ?)) AS distance FROM hospitals ORDER BY distance;'
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

const helloHandler = (req,res) => {
    res.status(200).send({
        hello: 'okay'
    })
}


module.exports= { helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler };