'use strict'

var express = require('express');
var ZoneController = require('../controllers/zone');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

const upload = require('../middlewares/confmulter');  // Importar el middleware

var api = express.Router(); const requestLogger = require('../middlewares/logging');

api.get('/pruebas', [requestLogger], ZoneController.pruebas);
api.get('/list', [requestLogger, mdAuth.ensureAuth], ZoneController.getZones);
api.get('/zone/:id', [mdAuth.ensureAuth, requestLogger], ZoneController.getZone);
api.post('/create', [mdAuth.ensureAdminAuth, requestLogger, upload.single('image')], ZoneController.createZone);
api.put('/update/:id', [mdAuth.ensureAdminAuth, requestLogger, upload.single('image')], ZoneController.updateZone);
api.delete('/delete/:id', [mdAuth.ensureAdminAuth, requestLogger], ZoneController.deleteZone);

module.exports = api;