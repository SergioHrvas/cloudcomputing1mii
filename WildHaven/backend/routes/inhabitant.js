'use strict'

import express from 'express';
import InhabitantController from '../controllers/inhabitant.js';
import mdAuth from '../middlewares/authenticated.js';

var api = express.Router();

import multipart from 'connect-multiparty';
var mdUpload = multipart({uploadDir: './uploads/inhabitants'})

api.get('/pruebas', InhabitantController.pruebas);
api.get('/list/:idSpecie?', InhabitantController.getInhabitants);
api.get('/:id', InhabitantController.getInhabitant);
api.post('/create', InhabitantController.createInhabitant);
api.put('/update/:id', InhabitantController.updateInhabitant);
api.delete('/delete/:id', InhabitantController.deleteInhabitant)


export default api;