'use strict'

var express = require('express');
var InventaryMovController = require('../controllers/inventoryMovement');
var mdAuth = require('../middlewares/authenticated');
const requestLogger = require('../middlewares/logging');

var api = express.Router();


api.get('/pruebas', requestLogger, InventaryMovController.pruebas);


module.exports = api;