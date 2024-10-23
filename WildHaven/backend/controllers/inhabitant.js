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


function createInhabitant(req, res) {
    var body = req.body;

    var new_inhabitant = new Inhabitant();
    new_inhabitant.name = body.name;
    new_inhabitant.description = body.description;
    new_inhabitant.personality = body.personality;
    new_inhabitant.healthStatus = body.healthStatus;
    new_inhabitant.alive = body.alive;
    new_inhabitant.image = body.image;
    new_inhabitant.birth = body.birth;
    new_inhabitant.specie = body.specie
    new_inhabitant.zone = body.zone


    Inhabitant.find({ name: body.name, specie: body.specie }).exec()
        .then(
            inhabitants => {
                if (inhabitants.length > 0) {
                    res.status(200).send({ message: "Ya existe un habitante con ese nombre y de esa especie" })
                }
                else if (!body.name) {
                    res.status(200).send({ message: "El nombre es obligatorio" })
                }
                else {
                    new_inhabitant.save().then(
                        inhabitantStored => {
                            if (inhabitantStored) {
                                res.status(200).send({ inhabitant: inhabitantStored });
                            } else {
                                res.status(404).send({ message: "No se ha guardado el habitante" });
                            }
                        }
                    ).catch
                    err => {
                        if (err) return res.status(500).send({ message: "Error al crear el habitante." + err });
                    }
                }
            }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error al obtener los habitantes." + err })

            }
        )
}

 
module.exports = {
    pruebas,
    getInhabitants,
    getInhabitant,
    createInhabitant,
}