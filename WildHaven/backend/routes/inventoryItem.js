'use strict'

var express = require('express');
var InventaryItemController = require('../controllers/inventoryItem');

var mdAuth = require('../middlewares/authenticated');

var api = express.Router();


api.get('/pruebas', InventaryItemController.pruebas);


module.exports = api;