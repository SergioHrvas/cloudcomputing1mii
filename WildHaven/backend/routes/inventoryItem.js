'use strict'

import express from 'express';
import InventaryItemController from '../controllers/inventoryItem.js';

var api = express.Router();
import mdAuth from '../middlewares/authenticated.js';


api.get('/pruebas', InventaryItemController.pruebas);


export default api;