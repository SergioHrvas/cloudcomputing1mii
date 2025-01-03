'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var Specie = require('../models/specie');
var Inhabitant = require('../models/inhabitant')

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


function pruebas(req, res) {
    res.status(200).send({
        message: "Acción de especies en el servidor de NodeJS"
    })
};

module.exports = {
    pruebas,
}



function getSpecie(req, res) {
    var id = req.params.id;

    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    Specie.findById(id).exec().then(
        specie => {
            if (!specie) return res.status(404).send({ message: "La especie no existe" });


            Inhabitant.find({specie: id}).then(
                inhabitants => {
                    return res.status(200).send({specie, inhabitants});
                }
            ).catch(err => {
                return res.status(500).send({ message: "Error en la petición"})
            })
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
            if (!species || (species.length == 0)) return res.status(404).send({ message: "No hay especies disponibles" });

            return res.status(200).send({ species });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener las especies." })
        }
    )
}

function createSpecie(req, res) {
    var body = req.body;

    if (req.file) {
        var file_path = req.file.destination;
        var file_name = req.file.filename;
    }

    var new_specie = new Specie();
    new_specie.name = body.name;
    new_specie.description = body.description;
    new_specie.diet = body.diet;
    new_specie.technical_name = body.technical_name;
    new_specie.image = file_name;

    Specie.find({ name: body.name }).exec()
        .then(
            species => {
                if (species.length > 0) {
                    res.status(400).send({ message: "Ya existe una especie con ese nombre" })
                }
                else if (!body.name) {
                    res.status(400).send({ message: "El nombre es obligatorio" })
                }
                else {
                    new_specie.save().then(
                        specieStored => {
                            if (specieStored) {
                                res.status(200).send({ specie: specieStored });
                            } else {
                                res.status(404).send({ message: "No se ha guardado la especie" });
                            }
                        }
                    ).catch
                    err => {
                        if (err) return res.status(500).send({ message: "Error en la petición." + err });
                    }
                }
            }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error en la petición." + err })
            }
        )
}


function updateSpecie(req, res) {
    var id = req.params.id;
    var body = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }


    if (req.file) {
        var file_path = req.file.destination;
        var file_name = req.file.filename;
    }


    Specie.findById(id).exec()
        .then(
            specie => {
                if(!specie){
                    return res.status(500).send({ message: "No existe la especie" })     
                }
                Specie.find({ name: body.name }).exec()
                    .then(species => {
                        var specie_isset = false;
                        species.forEach(specieEach => {
                            if (specieEach && (specieEach._id != id)) {
                                specie_isset = true;
                            }
                        });

                        if (specie_isset) {
                            return res.status(500).send({ message: "Los datos ya están en uso" })
                        }
                        else {
                            if (body.name) {
                                specie.name = body.name;
                            }
                            if (body.description) {
                                specie.description = body.description;
                            }
                            if (body.diet) {
                                specie.diet = body.diet;
                            }
                            if (body.technical_name) {
                                specie.technical_name = body.technical_name;
                            }
                            if (file_name){
                                specie.image = file_name;

                            }
                            specie.save().then(
                                specieStored => {
                                    if (specieStored) {
                                        res.status(200).send({ specie: specieStored });
                                    } else {
                                        res.status(404).send({ message: "No se ha guardado la especie" });
                                    }
                                }
                            ).catch(err => {
                                if (err) return res.status(500).send({ message: "Error al guardar la especie." + err });
                            })
                        }
                    }).catch(
                        err => {
                            if (err) return res.status(500).send({ message: "Error en la petición." + err });
                        }
                    )
            }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error en la petición." + err })

            }
        )
}




function deleteSpecie(req, res) {
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }


    Specie.findById(id).exec()
        .then(
            specie => {
                if(specie == null){
                    return res.status(404).send({ message: "No se ha podido encontrar la especie" });
                }

                Specie.deleteOne({_id: id}).exec().then(
                    data => {
                        if (data.deletedCount == 0) {
                            return res.status(404).send({ message: "No se ha podido eliminar la especie" });
                        }
            
                        
                        return res.status(200).send({ data });
                    }
                ).catch(
                    err => {
                        if(err){
                            return res.status(500).send({ message: "Error al eliminar las especies." + err })
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
    getSpecies,
    getSpecie,
    createSpecie,
    updateSpecie,
    deleteSpecie
}