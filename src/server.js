const express = require('express');
const app= express();
app.use(express.json())
const routes = require('./routes')
app.use(routes);
app.listen(5000, ()=>{console.log('server running on port 5000')})
