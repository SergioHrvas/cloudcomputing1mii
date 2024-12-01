'use strict'

var express = require('express');
var UserController = require('../controllers/user');
const requestLogger = require('../middlewares/logging');
var mdAuth = require('../middlewares/authenticated');
const upload = require('../middlewares/confmulter');  // Importar el middleware

var api = express.Router();

api.get('/pruebas', requestLogger, UserController.pruebas);
api.post('/register', requestLogger, UserController.saveUser);
api.post('/login',requestLogger, UserController.loginUser);
api.get('/user/:id', [mdAuth.ensureAuth,requestLogger], UserController.getUser)
api.get('/list/:page?/:itemsPerPage?', [mdAuth.ensureAuth,requestLogger], UserController.getUsers)
api.put('/update/:id',[mdAuth.ensureAuth,requestLogger, upload.single('image')], UserController.updateUser)
api.delete('/delete/:id',[mdAuth.ensureAuth,requestLogger], UserController.deleteUser)

module.exports = api;


