'use strict'

var express = require('express');
var InhabitantController = require('../controllers/inhabitant');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/inhabitants'})

api.get('/pruebas', mdAuth.ensureAuth, InhabitantController.pruebas);
api.get('/list/specie/:idSpecie',mdAuth.ensureAuth, InhabitantController.getInhabitantsBySpecie);
api.get('/list',mdAuth.ensureAuth, InhabitantController.getInhabitants);

api.get('/inhabitant/:id',mdAuth.ensureAuth, InhabitantController.getInhabitant);
api.post('/create', mdAuth.ensureAuth,InhabitantController.createInhabitant);
api.put('/update/:id', mdAuth.ensureAuth,InhabitantController.updateInhabitant);
api.delete('/delete/:id', mdAuth.ensureAuth,InhabitantController.deleteInhabitant)


module.exports = api;