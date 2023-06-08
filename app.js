require('dotenv').config();
const express = require('express');
const app= express();
app.use(express.json())
const routes = require('./src/routes')
app.use(routes);
app.listen(process.env.PORT, ()=>{console.log(`server running on port ${process.env.PORT}`)})