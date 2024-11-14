'use strict'

var express = require('express');
var InventaryItemController = require('../controllers/inventoryItem');

var mdAuth = require('../middlewares/authenticated');
const requestLogger = require('../middlewares/logging');

var api = express.Router();


api.get('/pruebas', requestLogger, InventaryItemController.pruebas);


module.exports = api;