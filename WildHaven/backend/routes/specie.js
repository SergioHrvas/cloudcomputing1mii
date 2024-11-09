'use strict'

var express = require('express');
var SpecieController = require('../controllers/specie');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/species'})

api.get('/pruebas', mdAuth.ensureAuth, SpecieController.pruebas);
api.get('/list', mdAuth.ensureAuth, SpecieController.getSpecies);
api.get('/specie/:id', mdAuth.ensureAuth, SpecieController.getSpecie);
api.post('/create', mdAuth.ensureAuth, SpecieController.createSpecie);
api.put('/update/:id', mdAuth.ensureAuth, SpecieController.updateSpecie);
api.delete('/delete/:id', mdAuth.ensureAuth, SpecieController.deleteSpecie)


module.exports = api;