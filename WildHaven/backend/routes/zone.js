'use strict'

var express = require('express');
var ZoneController = require('../controllers/zone');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/zone'})

api.get('/pruebas', ZoneController.pruebas);
api.get('/list', mdAuth.ensureAuth, ZoneController.getZones);
api.get('/zone/:id', mdAuth.ensureAuth, ZoneController.getZone);
api.post('/create', mdAuth.ensureAuth, ZoneController.createZone);
api.put('/update/:id', mdAuth.ensureAuth, ZoneController.updateZone);
api.delete('/delete/:id', mdAuth.ensureAuth, ZoneController.deleteZone);

module.exports = api;