'use strict'

var express = require('express');
var ZoneController = require('../controllers/zone');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

const upload = require('../middlewares/confmulter');  // Importar el middleware

var api = express.Router();const requestLogger = require('../middlewares/logging');

api.get('/pruebas', requestLogger, ZoneController.pruebas);
api.get('/list', [requestLogger, mdAuth.ensureAuth], ZoneController.getZones);
api.get('/zone/:id', [mdAuth.ensureAuth,requestLogger], ZoneController.getZone);
api.post('/create', [mdAuth.ensureAuth,requestLogger,upload.single('image')], ZoneController.createZone);
api.put('/update/:id', [mdAuth.ensureAuth,requestLogger], ZoneController.updateZone);
api.delete('/delete/:id', [mdAuth.ensureAuth,requestLogger], ZoneController.deleteZone);

module.exports = api;