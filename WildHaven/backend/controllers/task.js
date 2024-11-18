'use strict'

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


function pruebas(req, res){
    res.status(200).send({
        message:"Acción de tareas en el servidor de NodeJS"
    })
};
 
function getTask(req, res){
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    Task.findById(id).then(task => {
        if(!task){
            return res.status(400).send({message: "No se ha podido encontrar la tarea"})
        }

        return res.status(200).send({task})
    }
    ).catch(err => {
        return res.status(500).send({message:"Error en la petición"})
    })

};

function getTasks(req, res){
    Task.find().sort('name').exec().then(
        tareas => {
            if (!tareas || tareas.length == 0) return res.status(404).send({ message: "No hay tareas disponibles" });

            return res.status(200).send({ tareas });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener las tareas." })
        }
    )
};


function createTask(req, res){
    var body = req.body;
    var createdBy = req.user.sub;

    body.createdBy = createdBy;
    var task = new Task(body);

    task.save().then(taskSaved => {
        if(!taskSaved){
            res.status(400).send({message: "No se ha podido guardar la tarea"})
        }

        res.status(200).send({task: taskSaved})
    }
    ).catch(err => {
        res.status(500).send({message:"Error en la petición"})
    })

};

function deleteTask(req, res){
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    Task.findByIdAndDelete(id).then(data => {
        if(data.deletedCount == 0){
            res.status(400).send({message: "No se ha podido eliminar la tarea"})
        }

        res.status(200).send({data})
    }
    ).catch(err => {
        res.status(500).send({message:"Error en la petición"})
    })

};


module.exports = {
    pruebas,
    createTask,
    getTask,
    getTasks,
    deleteTask
}