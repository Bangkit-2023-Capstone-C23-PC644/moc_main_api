const express = require('express')
const{ helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler, getNearestTokenHandler, getHospitalSpecificHandler, rsRegisterHandler } = require('./handler')
const {verifyToken} = require('./middleware')

const routes = express.Router();

routes.get('/hello', helloHandler);
routes.get('/hospitals', getHospitalHandler)
routes.get('/hospitals/:id', getHospitalSpecificHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
routes.post('/shortest', getShortestHandler)
routes.get('/nearest', verifyToken, getNearestTokenHandler)
routes.post('/rsregister', rsRegisterHandler)
module.exports = routes;