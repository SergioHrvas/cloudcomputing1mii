'use strict'

import express from 'express';
import InventaryMovController from '../controllers/inventoryMovement.js';

var api = express.Router();
import mdAuth from '../middlewares/authenticated.js';


api.get('/pruebas', InventaryMovController.pruebas);


export default api;