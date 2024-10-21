'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var Specie = require('../models/specie');

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
        message:"Acción de especies en el servidor de NodeJS"
    })
};
 
module.exports = {
    pruebas,
}



function getSpecie(req, res) {
    var id = req.params.id;

    Specie.findById(id).exec().then(
        specie => {
            if (!specie) return res.status(404).send({ message: "La especie no existe" });

            return res.status(200).send({ specie });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener la especie." })
        }
    )
}

function getSpecies(req, res) {
    Specie.find().sort('name').exec().then(
        species => {
            if (!species) return res.status(404).send({ message: "No hay especies disponibles" });

            return res.status(200).send({ species });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener las especies." })
        }
    )
}


module.exports = {
    pruebas,
    getSpecies,
    getSpecie,
}