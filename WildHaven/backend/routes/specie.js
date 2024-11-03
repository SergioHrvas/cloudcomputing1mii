'use strict'

import express from 'express';
import SpecieController from '../controllers/specie.js';
import mdAuth from '../middlewares/authenticated.js';

var api = express.Router();

import multipart from 'connect-multiparty';
var mdUpload = multipart({uploadDir: './uploads/species'})

api.get('/pruebas', SpecieController.pruebas);
api.get('/list', SpecieController.getSpecies);
api.get('/:id', SpecieController.getSpecie);
api.post('/create', SpecieController.createSpecie);
api.put('/update/:id', SpecieController.updateSpecie);
api.delete('/delete/:id', SpecieController.deleteSpecie)


export default api;