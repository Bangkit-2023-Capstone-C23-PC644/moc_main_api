const express = require('express')
const{ helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler } = require('./handler')

const routes = express.Router();

routes.get('/hello', helloHandler);
routes.get('/hospitals', getHospitalHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
routes.get('/shortest', getShortestHandler)
module.exports = routes;