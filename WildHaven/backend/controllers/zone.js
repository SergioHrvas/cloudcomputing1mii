'use strict'

var Zone = require('../models/zone');

//Importamos el servicio de jwt token
var jwt = require('../services/jwt');


//Incluimos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
var fs = require('fs');
var path = require('path');
const { escape } = require('querystring');


function pruebas(req, res){
    res.status(200).send({
        message:"Acción de zonas en el servidor de NodeJS"
    })
};

function getZone(req, res){
    var id = req.params.id;

    Zone.findById(id).exec().then(
        zone => {
            if (!zone) return res.status(404).send({ message: "La zona no existe" });

            return res.status(200).send({ zone });
        }
    ).catch(
        err =>{
            if (err) return res.status(500).send({ message: "Error al obtener la zona." })
        }
    )
}

function getZones(req, res){
    Zone.find().sort('name').exec().then(
        zones => {
            if (!zones) return res.status(404).send({ message: "No hay zonas disponibles" });

            return res.status(200).send({ zones });
        }
    ).catch(
        err =>{
            if (err) return res.status(500).send({ message: "Error al obtener las zonas." })
        }
    )
}

module.exports = {
    pruebas,
    getZones,
    getZone
}