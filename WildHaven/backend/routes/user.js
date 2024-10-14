'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/users'})

api.get('/pruebas',  UserController.pruebas);

module.exports = api;