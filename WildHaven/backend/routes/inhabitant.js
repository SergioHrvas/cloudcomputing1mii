'use strict'

var express = require('express');
var InhabitantController = require('../controllers/inhabitant');
var mdAuth = require('../middlewares/authenticated');

const requestLogger = require('../middlewares/logging');

const upload = require('../middlewares/confmulter');  // Importar el middleware


var api = express.Router();

api.get('/pruebas', requestLogger, InhabitantController.pruebas);
api.get('/listBySpecie/:idSpecie',[mdAuth.ensureAuth,requestLogger], InhabitantController.getInhabitantsBySpecie);
api.get('/listByZone/:idZone',[mdAuth.ensureAuth,requestLogger], InhabitantController.getInhabitantsByZone);

api.get('/list',[requestLogger], InhabitantController.getInhabitants);
api.get('/inhabitant/:id',[mdAuth.ensureAuth,requestLogger], InhabitantController.getInhabitant);
api.post('/create', [mdAuth.ensureAdminAuth,requestLogger, upload.single('image')],InhabitantController.createInhabitant);
api.put('/update/:id', [mdAuth.ensureAdminAuth,requestLogger, upload.single('image')],InhabitantController.updateInhabitant);
api.delete('/delete/:id', [mdAuth.ensureAdminAuth,requestLogger],InhabitantController.deleteInhabitant)

module.exports = api;

