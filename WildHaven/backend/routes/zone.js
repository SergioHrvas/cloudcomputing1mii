'use strict'

var express = require('express');
var ZoneController = require('../controllers/zone');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/zone'})

api.get('/pruebas', ZoneController.pruebas);
api.get('/list', ZoneController.getZones);
api.get('/:id', ZoneController.getZone);
api.post('/create', ZoneController.createZone);

module.exports = api;