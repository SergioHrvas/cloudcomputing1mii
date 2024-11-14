'use strict'

var express = require('express');
var UserController = require('../controllers/user');
const requestLogger = require('../middlewares/logging');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/users'})

api.get('/pruebas', requestLogger, UserController.pruebas);
api.post('/register',requestLogger, UserController.saveUser);
api.post('/login',requestLogger, UserController.loginUser);
api.get('/user/:id', [mdAuth.ensureAuth,requestLogger], UserController.getUser)
api.get('/list/:page?/:itemsPerPage?', [mdAuth.ensureAuth,requestLogger], UserController.getUsers)
api.put('/update/:id',[mdAuth.ensureAuth,requestLogger], UserController.updateUser)
api.delete('/delete/:id',[mdAuth.ensureAuth,requestLogger], UserController.deleteUser)

module.exports = api;