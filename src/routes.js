const express = require('express')
const{ registerHandler, loginHandler, getNearestTokenHandler, getHospitalSpecificHandler, rsRegisterHandler, rsLoginHandler, mlhandler } = require('./handler')
const {verifyToken, verifyTokenRS} = require('./middleware')
const multer = require('multer'); 
const routes = express.Router();
const upload = multer();


routes.get('/hospitals/:id', verifyToken, getHospitalSpecificHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
routes.get('/nearest', verifyToken, getNearestTokenHandler)
routes.post('/rsregister', rsRegisterHandler)
routes.post('/rslogin', rsLoginHandler)
routes.post('/ml', upload.single('file'), verifyTokenRS, mlhandler)
module.exports = routes;