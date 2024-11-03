'use strict'

import Zone from '../models/zone.js';

// Importamos el servicio de jwt token
import jwt from '../services/jwt.js';
// Importamos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
import fs from 'fs';
import path from 'path';
import { escape } from 'querystring';


function pruebas(req, res) {
    res.status(200).send({
        message: "Acción de zonas en el servidor de NodeJS"
    })
};

function getZone(req, res) {
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }


    Zone.findById(id).exec().then(
        zone => {
            if (!zone) return res.status(404).send({ message: "La zona no existe" });

            return res.status(200).send({ zone });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener la zona." })
        }
    )
}

function getZones(req, res) {
    Zone.find().sort('name').exec().then(
        zones => {
            if (!zones) return res.status(404).send({ message: "No hay zonas disponibles" });

            return res.status(200).send({ zones });
        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error al obtener las zonas." })
        }
    )
}

function createZone(req, res) {
    var body = req.body;

    var new_zone = new Zone();
    new_zone.name = body.name;
    new_zone.description = body.description;



    Zone.find({ name: body.name }).exec()
        .then(
            zones => {
                if (zones.length > 0) {
                    res.status(200).send({ message: "Ya existe una zona con ese nombre" })
                }
                else if (!body.name) {
                    res.status(200).send({ message: "El nombre es obligatorio" })
                }
                else {
                    new_zone.save().then(
                        zoneStored => {
                            if (zoneStored) {
                                res.status(200).send({ zone: zoneStored });
                            } else {
                                res.status(404).send({ message: "No se ha guardado la zona" });
                            }
                        }
                    ).catch
                    err => {
                        if (err) return res.status(500).send({ message: "Error al obtener las zonas." + err });
                    }
                }
            }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error al crear la zona." + err })

            }
        )
}


function updateZone(req, res) {
    var id = req.params.id;
    var body = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }


    Zone.findById(id).exec()
        .then(
            zone => {
                    if(!zone){
                        return res.status(500).send({ message: "No existe la zona" })     
                    }
                    Zone.find({ name: body.name }).exec()
                        .then(zones => {
                            var zone_isset = false;
                            zones.forEach(zoneEach => {
                                if (zoneEach && (zoneEach._id != id)) {
                                    zone_isset = true;
                                }
                            });
                    
                            if (zone_isset) {
                                return res.status(500).send({ message: "Los datos ya están en uso" })
                            }
                            else {
                                if (body.name) {
                                    zone.name = body.name;
                                }
                                if (body.description) {
                                    zone.description = body.description;
                                }
                                zone.save().then(
                                    zoneStored => {
                                        if (zoneStored) {
                                            res.status(200).send({ zone: zoneStored });
                                        } else {
                                            res.status(404).send({ message: "No se ha guardado la zona" });
                                        }
                                    }
                                ).catch(err => {
                                    if (err) return res.status(500).send({ message: "Error al guardar las zonas." + err });
                                })
                            }
                        }).catch(
                            err => {
                                if (err) return res.status(500).send({ message: "Error al obtener las zonas." + err });
                            }
                        )
                }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error al obtener las zonas." + err })

            }
        )
}


function deleteZone(req, res) {
    var id = req.params.id;


    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }


    Zone.findById(id).exec()
        .then(
            zone => {
                if(zone == null){
                    return res.status(404).send({ message: "No se ha podido encontrar la zona" });
                }

                Zone.deleteOne({_id: id}).exec().then(
                    data => {
                        if (data.deletedCount == 0) {
                            return res.status(404).send({ message: "No se ha podido eliminar la zona" });
                        }
            
                        
                        return res.status(200).send({ data });
                    }
                ).catch(
                    err => {
                        if(err){
                            return res.status(500).send({ message: "Error al eliminar la zona." + err })
                        }
                    }
                )
            }
        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error al obtener las zonas." + err })

            }
        )
}


export default {
    pruebas,
    getZones,
    getZone,
    createZone,
    updateZone,
    deleteZone
}