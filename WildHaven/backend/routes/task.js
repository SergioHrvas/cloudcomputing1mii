'use strict'

var express = require('express');
var TaskController = require('../controllers/task');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
const requestLogger = require('../middlewares/logging');


api.get('/pruebas', requestLogger, TaskController.pruebas);
api.post('/create', mdAuth.ensureAuth, TaskController.createTask);


module.exports = api;