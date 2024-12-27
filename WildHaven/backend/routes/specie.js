'use strict'

var express = require('express');
var SpecieController = require('../controllers/specie');
var mdAuth = require('../middlewares/authenticated');

const requestLogger = require('../middlewares/logging');

var api = express.Router();

const upload = require('../middlewares/confmulter');  // Importar el middleware

api.get('/pruebas', requestLogger, SpecieController.pruebas);
api.get('/list', [mdAuth.ensureAdminAuth,requestLogger], SpecieController.getSpecies);
api.get('/specie/:id', [mdAuth.ensureAdminAuth,requestLogger], SpecieController.getSpecie);
api.post('/create', [mdAuth.ensureAdminAuth,requestLogger, upload.single('image')], SpecieController.createSpecie);
api.put('/update/:id', [mdAuth.ensureAdminAuth,requestLogger,  upload.single('image')], SpecieController.updateSpecie);
api.delete('/delete/:id', [mdAuth.ensureAdminAuth,requestLogger], SpecieController.deleteSpecie)

module.exports = api;

