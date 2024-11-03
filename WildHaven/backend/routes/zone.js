'use strict'

import express from 'express';
import ZoneController from '../controllers/zone.js';
import mdAuth from '../middlewares/authenticated.js';

var api = express.Router();
import multipart from 'connect-multiparty';
var mdUpload = multipart({uploadDir: './uploads/species'})

api.get('/pruebas', ZoneController.pruebas);
api.get('/list', ZoneController.getZones);
api.get('/:id', ZoneController.getZone);
api.post('/create', ZoneController.createZone);
api.put('/update/:id', ZoneController.updateZone);
api.delete('/delete/:id', ZoneController.deleteZone);

export default api;