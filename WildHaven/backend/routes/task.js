'use strict'

import express from 'express';
import TaskController from '../controllers/task.js';

var api = express.Router();
import mdAuth from '../middlewares/authenticated.js';


api.get('/pruebas', TaskController.pruebas);


export default api;