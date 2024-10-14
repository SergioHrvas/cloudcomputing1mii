'use strict'

var express = require('express');
var InventaryMovController = require('../controllers/inventoryMovement');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();


api.get('/pruebas', InventaryMovController.pruebas);


module.exports = api;