const express = require('express')
const{ helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler, getNearestTokenHandler } = require('./handler')
const {verifyToken} = require('./middleware')

const routes = express.Router();

routes.get('/hello', helloHandler);
routes.get('/hospitals', getHospitalHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
routes.get('/shortest', getShortestHandler)
routes.get('/nearest', verifyToken, getNearestTokenHandler)
module.exports = routes;