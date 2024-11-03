'use strict'



import InventoryMovement from '../models/inventoryMovement.js';

//Incluimos modulo bcrypt para encriptar las contraseñas
import bcrypt from 'bcrypt-nodejs';

//Importamos la libreria moment para generar fechas
import moment from "moment"

//Importamos el servicio de jwt token
import jwt from '../services/jwt.js';

//Importamos mongoose paginate
import mongoosePaginate from 'mongoose-pagination';

//Incluimos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
import fs from 'fs';
import path from 'path';
import escape from 'querystring';


function pruebas(req, res){
    res.status(200).send({
        message:"Acción de inventoryMovement en el servidor de NodeJS"
    })
};
 
export default {
    pruebas,
}