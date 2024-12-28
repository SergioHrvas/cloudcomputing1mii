'use strict'

var Zone = require('../models/zone');
var Inhabitant = require('../models/inhabitant')
//Importamos el servicio de jwt token
var jwt = require('../services/jwt');


//Incluimos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
var fs = require('fs');
var path = require('path');
const { escape } = require('querystring');


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

            Inhabitant.find({ zone: id }).then(
                inhabitants => {
                    return res.status(200).send({ zone, inhabitants });
                }
            ).catch(err => {
                return res.status(500).send({ message: "Error en la petición" })
            })

        }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error en la petición." })
        }
    )
}

function getZones(req, res) {
    Zone.find().sort('name').exec().then(
        zones => {
            if (!zones || zones.length == 0) return res.status(404).send({ message: "No hay zonas disponibles" });

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

    if (req.file) {
        var file_path = req.file.destination;
        var file_name = req.file.filename;
    }

    var new_zone = new Zone();
    new_zone.name = body.name;
    new_zone.description = body.description;
    new_zone.image = file_name;



    Zone.find({ name: body.name }).exec()
        .then(
            zones => {
                if (zones.length > 0) {
                    res.status(400).send({ message: "Ya existe una zona con ese nombre" })
                }
                else if (!body.name) {
                    res.status(400).send({ message: "El nombre es obligatorio" })
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

    if(req.file){
        var file_path = req.file.destination;
        var file_name = req.file.filename;
    }

    body.image = file_name

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })
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


                Zone.findById(id).exec()
                    .then(
                        zone => {
                            if (!zone) {
                                return res.status(500).send({ message: "No existe la zona" })
                            }
                            var old_path = zone.image;

                            if (body.name) {
                                zone.name = body.name;
                            }
                            if (body.description) {
                                zone.description = body.description;
                            }
                            if (body.image) {
                                zone.image = body.image;
                            }
                            

                            zone.save().then(
                                zoneStored => {

                                    // Si tenía ya una imagen, la borramos
                                    if (old_path && old_path.length > 0) {

                                        const filePath = file_path + "\\" + old_path;
                                        
                                        // Verificamos si el archivo existe
                                        fs.access(filePath, fs.constants.F_OK, (err) => {
                                            if (!err) {
                                                // Si el archivo existe, lo eliminamos
                                                fs.unlink(filePath, (err) => {
                                                    if (err) {
                                                        console.error("Error al eliminar el archivo:", err);
                                                    } else {
                                                        console.log("Archivo eliminado con éxito.");
                                                    }
                                                });
                                            }
                                        });
                                    }

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
                    ).catch(
                        err => {
                            if (err) return res.status(500).send({ message: "Error en la petición." + err })

                        }
                    )
            }
        }).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error en la petición." + err });
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
                if (zone == null) {
                    return res.status(404).send({ message: "No se ha podido encontrar la zona" });
                }

                Zone.deleteOne({ _id: id }).exec().then(
                    data => {
                        if (data.deletedCount == 0) {
                            return res.status(404).send({ message: "No se ha podido eliminar la zona" });
                        }


                        return res.status(200).send({ data });
                    }
                ).catch(
                    err => {
                        if (err) {
                            return res.status(500).send({ message: "Error al eliminar la zona." + err })
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
    getZones,
    getZone,
    createZone,
    updateZone,
    deleteZone
}