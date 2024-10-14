'use strict'

var express = require('express');
var TaskController = require('../controllers/task');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');


api.get('/pruebas', TaskController.pruebas);


module.exports = api;