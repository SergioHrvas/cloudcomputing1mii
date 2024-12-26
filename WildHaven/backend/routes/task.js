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
api.delete('/delete/:id', [mdAuth.ensureAuth,requestLogger], TaskController.deleteTask);
api.put('/task/:id', [mdAuth.ensureAuth,requestLogger], TaskController.updateTask);

api.get('/tasksToUser/:id', [mdAuth.ensureAuth,requestLogger], TaskController.getUserTasks)
api.get('/tasksByUser/:id', [mdAuth.ensureAuth,requestLogger], TaskController.getUserOwnedTasks)
api.put('/changeStatus/:id', [mdAuth.ensureAuth,requestLogger], TaskController.changeStatus);
api.put('/assignTask/:id', [mdAuth.ensureAuth,requestLogger], TaskController.assignTask);

module.exports = api;