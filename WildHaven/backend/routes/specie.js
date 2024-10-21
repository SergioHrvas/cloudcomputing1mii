'use strict'

var express = require('express');
var SpecieController = require('../controllers/specie');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/species'})

api.get('/pruebas', SpecieController.pruebas);
api.get('/list', SpecieController.getSpecies);
api.get('/:id', SpecieController.getSpecie);
api.post('/create', SpecieController.createSpecie);
api.put('/update/:id', SpecieController.updateSpecie);
api.delete('/delete/:id', SpecieController.deleteSpecie)


module.exports = api;