'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
import bcrypt from 'bcrypt-nodejs';

import Inhabitant from '../models/inhabitant.js';

//Importamos la libreria moment para generar fechas
import moment from "moment"

//Importamos el servicio de jwt token
import jwt from '../services/jwt.js';

//Importamos mongoose paginate
import mongoosePaginate from 'mongoose-pagination';

//Incluimos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
import fs from 'fs';
import path from 'path';
import escape from 'querystring';


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
                                inhabitant.name = body.name;
                                inhabitant.description = body.description;
                                inhabitant.personality = body.personality;
                                inhabitant.healthStatus = body.healthStatus;
                                inhabitant.alive = body.alive;
                                inhabitant.image = body.image;
                                inhabitant.birth = body.birth;
                                inhabitant.specie = body.specie
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
                if (err) return res.status(500).send({ message: "Error al obtener las zonas." + err })

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
                    return res.status(404).send({ message: "No se ha podido encontrar la zona" });
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
                if (err) return res.status(500).send({ message: "Error al obtener los habitantes." + err })

            }
        )
}

export default {
    pruebas,
    getInhabitants,
    getInhabitant,
    createInhabitant,
    updateInhabitant,
    deleteInhabitant
}