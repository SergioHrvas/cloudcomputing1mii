'use strict'

var express = require('express');
var InhabitantController = require('../controllers/inhabitant');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/inhabitants'})

api.get('/pruebas', InhabitantController.pruebas);
api.get('/list/:idSpecie?', InhabitantController.getInhabitants);
api.get('/:id', InhabitantController.getInhabitant);
api.post('/create', InhabitantController.createInhabitant);
api.put('/update/:id', InhabitantController.updateInhabitant);


module.exports = api;