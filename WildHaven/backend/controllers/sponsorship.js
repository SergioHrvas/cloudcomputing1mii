'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var Sponsorship = require('../models/sponsorship');

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
        message:"Acción de  de usuarios en el servidor de NodeJS"
    })
};
 
function createSponsorship(req, res){
    var sponsorship = new Sponsorship();
    var params = req.body;

    sponsorship.name = params.name;
    sponsorship.description = params.description;
    sponsorship.price = params.price;
    sponsorship.duration = params.duration;
    sponsorship.image = null;

    sponsorship.save((err, sponsorshipStored) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al guardar el patrocinio'});
        }else{
            if(!sponsorshipStored){
                res.status(404).send({message: 'No se ha registrado el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipStored});
            }
        }
    });
}

function getSponsorships(req, res){
    Sponsorship.find((err, sponsorships) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al obtener los patrocinios'});
        }else{
            if(!sponsorships){
                res.status(404).send({message: 'No se han encontrado patrocinios'});
            }else{
                res.status(200).send({sponsorships});
            }
        }
    });
}

function getSponsorship(req, res){
    var sponsorshipId = req.params.id;

    Sponsorship.findById(sponsorshipId, (err, sponsorship) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al obtener el patrocinio'});
        }else{
            if(!sponsorship){
                res.status(404).send({message: 'No se ha encontrado el patrocinio'});
            }else{
                res.status(200).send({sponsorship});
            }
        }
    });
}

function updateSponsorship(req, res){
    var sponsorshipId = req.params.id;
    var update = req.body;

    //Me aseguro de que soy el propietario del patrocinio o el administrador
    if(update.user != req.user.sub && req.user.role != 'ROLE_ADMIN'){
        return res.status(500).send({message: 'No tienes permiso para actualizar el patrocinio'});
    }

    Sponsorship.findByIdAndUpdate
    (sponsorshipId, update, (err, sponsorshipUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al actualizar el patrocinio'});
        }else{
            if(!sponsorshipUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipUpdated});
            }
        }
    });
}

function deleteSponsorship(req, res){
    var sponsorshipId = req.params.id;

    
    //Me aseguro de que soy el propietario del patrocinio o el administrador
    if(update.user != req.user.sub && req.user.role != 'ROLE_ADMIN'){
        return res.status(500).send({message: 'No tienes permiso para actualizar el patrocinio'});
    }
    
    
    Sponsorship.findByIdAndRemove(sponsorshipId, (err, sponsorshipRemoved) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al eliminar el patrocinio'});
        }else{
            if(!sponsorshipRemoved){
                res.status(404).send({message: 'No se ha podido eliminar el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipRemoved});
            }
        }
    });
}

function finishSponsorship(req, res){
    var sponsorshipId = req.params.id;
    var update = {active: false};

    Sponsor.findByIdAndUpdate(sponsorshipId, update, (err, sponsorshipFinished) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al finalizar el patrocinio'});
        }else{
            if(!sponsorshipFinished){
                res.status(404).send({message: 'No se ha podido finalizar el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipFinished});
            }
        }
    });
}

function getMySponsorships(req, res){
    var userId = req.params.id;

    Sponsorship.find({user: userId}, (err, sponsorships) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al obtener los patrocinios'});
        }else{
            if(!sponsorships){
                res.status(404).send({message: 'No se han encontrado patrocinios'});
            }else{
                res.status(200).send({sponsorships});
            }
        }
    });
}

function getSponsorShipOfInhabitant(req, res){
    var inhabitantId = req.params.id;

    Sponsorship.find({inhabitant: inhabitantId}, (err, sponsorships) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor al obtener los patrocinios'});
        }else{
            if(!sponsorships){
                res.status(404).send({message: 'No se han encontrado patrocinios'});
            }else{
                res.status(200).send({sponsorships});
            }
        }
    });
}


module.exports = {
    pruebas,
    createSponsorship,
    getSponsorships,
    getSponsorship,
    updateSponsorship,
    deleteSponsorship,
    finishSponsorship,
    getMySponsorships,
    getSponsorShipOfInhabitant
}