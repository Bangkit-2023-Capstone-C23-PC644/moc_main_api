const express = require('express')
const{ helloHandler, getHospitalHandler, registerHandler, loginHandler } = require('./handler')

const routes = express.Router();

routes.get('/hello', helloHandler);
routes.get('/hospitals', getHospitalHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
module.exports = routes;