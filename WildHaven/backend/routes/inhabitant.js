'use strict'

var express = require('express');
var InhabitantController = require('../controllers/inhabitant');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
const requestLogger = require('../middlewares/logging');
var mdUpload = multipart({uploadDir: './uploads/inhabitants'})

api.get('/pruebas', requestLogger, InhabitantController.pruebas);
api.get('/list/specie/:idSpecie',[mdAuth.ensureAuth,requestLogger], InhabitantController.getInhabitantsBySpecie);
api.get('/list',[mdAuth.ensureAuth,requestLogger], InhabitantController.getInhabitants);

api.get('/inhabitant/:id',[mdAuth.ensureAuth,requestLogger], InhabitantController.getInhabitant);
api.post('/create', [mdAuth.ensureAuth,requestLogger],InhabitantController.createInhabitant);
api.put('/update/:id', [mdAuth.ensureAuth,requestLogger],InhabitantController.updateInhabitant);
api.delete('/delete/:id', [mdAuth.ensureAuth,requestLogger],InhabitantController.deleteInhabitant)


module.exports = api;