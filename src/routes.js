const express = require('express')
const{ helloHandler, getHospitalHandler, registerHandler, loginHandler, getShortestHandler, getNearestTokenHandler, getHospitalSpecificHandler, rsRegisterHandler, rsLoginHandler, mlhandler } = require('./handler')
const {verifyToken, verifyTokenRS} = require('./middleware')
const multer = require('multer'); 
const routes = express.Router();
const upload = multer();


routes.get('/hello', helloHandler);
routes.get('/hospitals', getHospitalHandler)
routes.get('/hospitals/:id', getHospitalSpecificHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
routes.post('/shortest', getShortestHandler)
routes.get('/nearest', verifyToken, getNearestTokenHandler)
routes.post('/rsregister', rsRegisterHandler)
routes.post('/rslogin', rsLoginHandler)
routes.post('/ml', upload.single('file'), verifyTokenRS, mlhandler)
module.exports = routes;