'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var Inhabitant = require('../models/inhabitant');

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


function pruebas(req, res){
    res.status(200).send({
        message:"Acción de habitantes en el servidor de NodeJS"
    })
};

function getInhabitant(req, res) {
    var id = req.params.id;
    

    Inhabitant.findById(id).exec().then(
        inhabitant => {
            if (!inhabitant) return res.status(404).send({ message: "El habitante no existe" });

            return res.status(200).send({ inhabitant });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener el habitante." })
        }
    )
}

function getInhabitants(req, res) {
    var specie = req.params.idSpecie;

    Inhabitant.find(specie != null ? {specie: specie} : {}).sort('name').exec().then(
        inhabitants => {
            if (!inhabitants) return res.status(404).send({ message: "No hay habitantes disponibles" });

            return res.status(200).send({ inhabitants });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener los habitantes." })
        }
    )
}


 
module.exports = {
    pruebas,
    getInhabitants,
    getInhabitant,

}