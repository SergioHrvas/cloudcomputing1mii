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
 
function createSponsorship(req, res) {
    var sponsorship = new Sponsorship();
    var params = req.body;

    sponsorship.sponsor = req.user.sub;
    sponsorship.inhabitant = params.id;
    sponsorship.startDate = moment().format('YYYY-MM-DD');
    sponsorship.contributionAmount = 20;
    sponsorship.status = 'active';

    sponsorship.save()
        .then(sponsorshipStored => {
            if (!sponsorshipStored) {
                res.status(404).send({ message: 'No se ha registrado el patrocinio' });
            } else {
                res.status(200).send({ sponsorship: sponsorshipStored });
            }
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en el servidor al guardar el patrocinio' });
        });
}

function getSponsorships(req, res){
    Sponsorship.find().exec()
        .then(sponsorships => {
            if(!sponsorships){
                res.status(404).send({message: 'No se han encontrado patrocinios'});
            }else{
                res.status(200).send({sponsorships});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al obtener los patrocinios'});
        });
}

function getSponsorship(req, res){
    var sponsorshipId = req.params.id;

    Sponsorship.findById(sponsorshipId).exec()
        .then(sponsorship => {
            if(!sponsorship){
                res.status(404).send({message: 'No se ha encontrado el patrocinio'});
            }else{
                res.status(200).send({sponsorship});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al obtener el patrocinio'});
        });
}

function updateSponsorship(req, res){
    var sponsorshipId = req.params.id;
    var update = req.body;

    //Me aseguro de que soy el propietario del patrocinio o el administrador
    if(update.user != req.user.sub && req.user.role != 'ROLE_ADMIN'){
        return res.status(500).send({message: 'No tienes permiso para actualizar el patrocinio'});
    }

    Sponsorship.findByIdAndUpdate(sponsorshipId, update, {new: true}).exec()
        .then(sponsorshipUpdated => {
            if(!sponsorshipUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipUpdated});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al actualizar el patrocinio'});
        });
}

function deleteSponsorship(req, res){
    var sponsorshipId = req.params.id;

    //Me aseguro de que soy el propietario del patrocinio o el administrador
    if(req.body.user != req.user.sub && req.user.role != 'ROLE_ADMIN'){
        return res.status(500).send({message: 'No tienes permiso para eliminar el patrocinio'});
    }

    Sponsorship.findByIdAndRemove(sponsorshipId).exec()
        .then(sponsorshipRemoved => {
            if(!sponsorshipRemoved){
                res.status(404).send({message: 'No se ha podido eliminar el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipRemoved});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al eliminar el patrocinio'});
        });
}

function finishSponsorship(req, res){
    var user = req.user.sub;
    var inhabitant = req.body.id;

    console.log(inhabitant)
    console.log(user)

    Sponsorship.findOneAndUpdate({sponsor: user, inhabitant: inhabitant, status: 'active'}, {status: 'inactive'}, {new: true}).exec()
        .then(sponsorshipUpdated => {
            if(!sponsorshipUpdated){
                res.status(404).send({message: 'No se ha podido finalizar el patrocinio'});
            }else{
                res.status(200).send({sponsorship: sponsorshipUpdated});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al finalizar el patrocinio'});
        });
}

function getMySponsorships(req, res){
    var userId = req.user.sub;

    Sponsorship.find({sponsor: userId}).populate('inhabitant', 'name').exec()
        .then(sponsorships => {
            console.log(sponsorships)
            console.log(userId)
            if(!sponsorships){
                res.status(404).send({message: 'No se han encontrado patrocinios'});
            }else{
                res.status(200).send({sponsorships});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al obtener los patrocinios'});
        });
}

function getSponsorShipOfInhabitant(req, res){
    var inhabitantId = req.params.id;

    Sponsorship.find({inhabitant: inhabitantId}).exec()
        .then(sponsorships => {
            if(!sponsorships){
                res.status(404).send({message: 'No se han encontrado patrocinios'});
            }else{
                res.status(200).send({sponsorships});
            }
        })
        .catch(err => {
            res.status(500).send({message: 'Error en el servidor al obtener los patrocinios'});
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
