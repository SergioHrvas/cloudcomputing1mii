'use strict'

import express from 'express';
import UserController from '../controllers/user.js';

var api = express.Router();

import mdAuth from '../middlewares/authenticated.js';

import multipart from 'connect-multiparty';
var mdUpload = multipart({uploadDir: './uploads/users'})

api.get('/pruebas',  UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/:id', mdAuth, UserController.getUser)
api.get('/list/:page/:itemsPerPage', mdAuth, UserController.getUsers)
api.put('/update/:id', mdAuth, UserController.updateUser)
api.delete('/delete/:id', mdAuth, UserController.deleteUser)

export default api;