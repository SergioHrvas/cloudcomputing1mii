'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/users'})

api.get('/pruebas',  UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/:id', mdAuth.ensureAuth, UserController.getUser)
api.get('/list/:page/:itemsPerPage', mdAuth.ensureAuth, UserController.getUsers)
api.put('/update/:id', mdAuth.ensureAuth, UserController.updateUser)

module.exports = api;