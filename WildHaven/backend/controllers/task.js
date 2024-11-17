'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var Task = require('../models/task');

//Importamos la libreria moment para generar fechas
var moment = require("moment");

//Importamos el servicio de jwt token
var jwt = require('../services/jwt');

//Importamos mongoose paginate
var mongoosePaginate = require('mongoose-pagination');

//Incluimos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
var fs = require('fs');
var path = require('path');
const { escape } = require('querystring');
const { create } = require('domain');


function pruebas(req, res){
    res.status(200).send({
        message:"Acción de tareas en el servidor de NodeJS"
    })
};
 

function createTask(req, res){
    var body = req.body;
    var assignedBy = req.user.sub;
    
    if(body.assignedTo){
        body.assignedBy = assignedBy;
    }

    Task.save(body).then(taskSaved => {
        if(!taskSaved){
            res.status(400).send({message: "No se ha podido guardar la tarea"})
        }

        res.status(200).send({task: taskSaved})
    }
    ).catch(err => {
        res.status(500).send({message:"Error en la petición"})
    })



};


module.exports = {
    pruebas,
    createTask
}