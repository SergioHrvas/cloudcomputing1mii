'use strict'

var express = require('express');
var SpecieController = require('../controllers/specie');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
const requestLogger = require('../middlewares/logging');
var mdUpload = multipart({uploadDir: './uploads/species'})

api.get('/pruebas', requestLogger, SpecieController.pruebas);
api.get('/list', [mdAuth.ensureAuth,requestLogger], SpecieController.getSpecies);
api.get('/specie/:id', [mdAuth.ensureAuth,requestLogger], SpecieController.getSpecie);
api.post('/create', [mdAuth.ensureAuth,requestLogger], SpecieController.createSpecie);
api.put('/update/:id', [mdAuth.ensureAuth,requestLogger], SpecieController.updateSpecie);
api.delete('/delete/:id', [mdAuth.ensureAuth,requestLogger], SpecieController.deleteSpecie)


module.exports = api;