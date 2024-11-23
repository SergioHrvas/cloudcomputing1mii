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
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }


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

function getInhabitantsBySpecie(req, res) {
    var specie = req.params.idSpecie;

    if (!specie.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    Inhabitant.find(specie != null ? {specie: specie} : {}).sort('name').exec().then(
        inhabitants => {
            if (!inhabitants || (inhabitants.length == 0 )) return res.status(404).send({ message: "No hay habitantes disponibles" });

            return res.status(200).send({ inhabitants });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener los habitantes." })
        }
    )
}


function getInhabitants(req, res) {

    Inhabitant.find().sort('name').exec().then(
        inhabitants => {
            if (!inhabitants || (inhabitants.length == 0 )) return res.status(404).send({ message: "No hay habitantes disponibles" });

            return res.status(200).send({ inhabitants });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener los habitantes." })
        }
    )
}

function getInhabitantsByZone(req, res) {
    var zone = req.params.idZone;

    if (!zone.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    Inhabitant.find(zone != null ? {zone: zone} : {}).sort('name').exec().then(
        inhabitants => {
            if (!inhabitants || (inhabitants.length == 0 )) return res.status(404).send({ message: "No hay habitantes disponibles" });

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
                    res.status(400).send({ message: "Ya existe un habitante con ese nombre y de esa especie" })
                }
                else if (!body.name) {
                    res.status(400).send({ message: "El nombre es obligatorio" })
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
                if (err) return res.status(500).send({ message: "Error en la petición" + err })

            }
        )
}



function updateInhabitant(req, res) {
    var id = req.params.id;
    var body = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    Inhabitant.findById(id).exec()
        .then(
            inhabitant => {
                    if(inhabitant == null){
                        return res.status(500).send({ message: "No existe el habitante" })     
                    }
                    Inhabitant.find({ name: body.name }).exec()
                        .then(inhabitants => {
                            var inhabitant_isset = false;
                            inhabitants.forEach(inhabitantEach => {
                                if (inhabitantEach && (inhabitantEach._id != id)) {
                                    inhabitant_isset = true;
                                }
                            });
                    
                            if (inhabitant_isset) {
                                return res.status(500).send({ message: "Los datos ya están en uso" })
                            }
                            else {
                                if(body.name)
                                    inhabitant.name = body.name;
                                if(inhabitant.description)
                                    inhabitant.description = body.description;
                                if(body.personality)
                                    inhabitant.personality = body.personality;
                                if(body.healthStatus)
                                    inhabitant.healthStatus = body.healthStatus;
                                if(body.alive)
                                    inhabitant.alive = body.alive;
                                if(body.image)
                                    inhabitant.image = body.image;
                                if(body.birth)
                                    inhabitant.birth = body.birth;
                                if(body.specie)
                                    inhabitant.specie = body.specie
                                if(body.zone)
                                    inhabitant.zone = body.zone


                                inhabitant.save().then(
                                    inhabitantStored => {
                                        if (inhabitantStored) {
                                            res.status(200).send({ inhabitant: inhabitantStored });
                                        } else {
                                            res.status(404).send({ message: "No se ha guardado el habitante" });
                                        }
                                    }
                                ).catch(err => {
                                    if (err) return res.status(500).send({ message: "Error al guardar los habitantes." + err });
                                })
                            }
                        }).catch(
                            err => {
                                if (err) return res.status(500).send({ message: "Error al obtener los habitantes." + err });
                            }
                        )
                }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error en la petición." + err })

            }
        )
}

 
function deleteInhabitant(req, res) {
    var id = req.params.id;


    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    
    Inhabitant.findById(id).exec()
        .then(
            inhabitant => {
                if(inhabitant == null){
                    return res.status(404).send({ message: "No se ha podido encontrar el habitante" });
                }

                Inhabitant.deleteOne({_id: id}).exec().then(
                    data => {
                        if (data.deletedCount == 0) {
                            return res.status(404).send({ message: "No se ha podido eliminar el habitante" });
                        }
            
                        
                        return res.status(200).send({ data });
                    }
                ).catch(
                    err => {
                        if(err){
                            return res.status(500).send({ message: "Error al eliminar el habitante." + err })
                        }
                    }
                )
            }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error en la petición." + err })

            }
        )
}

module.exports = {
    pruebas,
    getInhabitants,
    getInhabitantsBySpecie,
    getInhabitant,
    createInhabitant,
    updateInhabitant,
    deleteInhabitant,
    getInhabitantsByZone
}