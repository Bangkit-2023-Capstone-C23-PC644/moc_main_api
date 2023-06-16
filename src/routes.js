const express = require('express')
const{ registerHandler, loginHandler, getNearestTokenHandler, getHospitalSpecificHandler, rsRegisterHandler, rsLoginHandler, mlhandler } = require('./handler')
const {verifyToken, verifyTokenRS} = require('./middleware')
const multer = require('multer'); 
const routes = express.Router();

const fileFilter = function (req, file, cb) {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('File type not supported'), false); // Reject the file
    }
  };
const upload = multer({fileFilter: fileFilter});


routes.get('/hospitals/:id', verifyToken, getHospitalSpecificHandler)
routes.post('/register', registerHandler)
routes.post('/login', loginHandler)
routes.get('/nearest', verifyToken, getNearestTokenHandler)
routes.post('/rsregister', rsRegisterHandler)
routes.post('/rslogin', rsLoginHandler)
routes.post('/ml', upload.single('file'), verifyTokenRS, mlhandler)
module.exports = routes;