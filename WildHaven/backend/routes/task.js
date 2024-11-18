'use strict'

var express = require('express');
var TaskController = require('../controllers/task');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
const requestLogger = require('../middlewares/logging');


api.get('/pruebas', requestLogger, TaskController.pruebas);
api.post('/create', [mdAuth.ensureAuth,requestLogger], TaskController.createTask);
api.get('/task/:id', [mdAuth.ensureAuth,requestLogger], TaskController.getTask);
api.get('/list/:page?/:itemsPerPage?', [mdAuth.ensureAuth,requestLogger], TaskController.getTasks)
api.delete('/task/:id', [mdAuth.ensureAuth,requestLogger], TaskController.deleteTask);


module.exports = api;