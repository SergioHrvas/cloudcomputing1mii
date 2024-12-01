'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

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
const user = require('../models/user');


function pruebas(req, res) {
    res.status(200).send({
        message: "Acción de usuarios en el servidor de NodeJS"
    })
};


//Registro de usuario
function saveUser(req, res) {
    //Recogemos los parámetros de la request
    var params = req.body;

    //Creamos una instancia/objeto de usuario (de su modelo)
    var user = new User();

    if (params.name && params.surname && params.password && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = null;
        user.created_at = moment().unix();

        User.find({ email: user.email.toLowerCase() }).exec().then(users => {
            if (users && users.length > 0) {
                return res.status(400).send({ message: "Ya existe un usuario con ese correo electrónico" });
            }
            else {
                //Encriptamos la contraseña
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    //Guardamos el usuario
                    user.save().then(userStored => {
                        //Si se ha guardado, devuelvo el usuario
                        userStored.password = undefined;
                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: "No se ha registrado el usuario" });
                        }
                    }).catch(err => {
                        if (err) return res.status(500).send({ message: "Error al guardar el usuario." })
                    })

                });
            }


        }).catch(err => {
            if (err) return res.status(500).send({ message: "Error en la petición de registro: " + err});
        })

    }
    else {
        res.status(400).send({
            message: "Envía todos los campos obligatorios."
        })
    }
}

//Login de usuario
function loginUser(req, res) {
    //Recogemos los parámetros del body
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }).exec().then(
        user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        //Devuelvo los datos del usuario
                        if (params.gettoken) {
                            //devolver token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        } else {
                            user.password = undefined;
                            return res.status(200).send({ user });
                        }

                    }
                    else {
                        return res.status(404).send({ message: "El usuario no se ha podido identificar." });
                    }
                })
            }
            else {
                return res.status(404).send({ message: "No se ha podido encontrar el usuario." });
            }
        }

    ).catch(
        err => {
            return res.status(500).send({ message: "Error en la petición." });
        }
    )
}


//Obtener datos de usuario
function getUser(req, res) {
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    User.findById(id).exec().then(user => {
        if (!user) {
            return res.status(404).send({ message: "El usuario no existe" });
        }


        return res.status(200).send({ user });

    }).catch(err => {
        if (err) return res.status(500).send({ message: "Error en la petición" });

    });
}

//Obtener lista de usuarios paginados
function getUsers(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if (req.params.itemsPerPage) {
        itemsPerPage = req.params.itemsPerPage
    }


    User.find().select(['-password']).sort('_id').paginate(page, itemsPerPage).then((users) => {
        if (!users ||users.length === 0){
            return res.status(404).send({ message: "No hay usuarios disponibles" });
        }

        var total = users.length;

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage),
        })
    }).catch(err => {
        return res.status(500).send({ message: "Error en la petición" });
    })
}


//Le pasamos la respuesta para poder devolverla
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
           return res.status(200).send({message});
   });
}

//Editar datos de usuarios
function updateUser(req, res) {
    var id = req.params.id;
    var update = req.body;

    if(req.file){
        var file_path = req.file.destination;
        var file_name = req.file.filename;
    }

    update.image = file_name

    //Eliminamos la propiedad contraseña por seguridad (se modificará en un método por separado)
    delete update.password;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    //Comprobamos si el id del usuario coincide con el que me llega en la request
    if (id != req.user.sub) {
        return res.status(403).send({ message: "No tienes permisos para actualizar los datos del usuario." })
    }

    if(!update.email){
        update.email = ""
    }

    User.find({ email: update.email.toLowerCase() }).exec().then(users => {
        if(update.email == ""){
            update.email = undefined;
        }
        
        if(users.length > 0)
        {
            var user_isset = false;
            users.forEach(user => {
                if (user && (user._id != id)) {
                    user_isset = true;
                }
            });

            if (user_isset) {
                return res.status(500).send({ message: "Los datos ya están en uso" })
            }
        }

        User.findById(id).exec().then(
            old_user => {
            
                var old_path = old_user.image;

                User.findByIdAndUpdate(id, update, { new: true }).exec().then(
                    userUpdated => {
                        if (!userUpdated) {
                            return res.status(404).send({ message: "No se ha podido actualizar el usuario" });
                        }       
                        

                        // Si tenía ya una imagen, la borramos
                        if (old_path.length > 0) {

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
        
                        return res.status(200).send({ user: userUpdated });
                    }
                ).catch(
                    err => {
                        if (err) return res.status(500).send({ message: "Error en la petición1" });
                    }
                )
            }





        ).catch(
            err => {
                if (err) return res.status(500).send({ message: "Error en la petición2" });
            }
        )

 
    }
    ).catch(
        err => {
            if (err) return res.status(500).send({ message: "Error en la petición3" });
        }
    )

}

function deleteUser(req, res) {
    var id = req.params.id;
    //Comprobamos si el id del usuario coincide con el que me llega en la request
    if ((id != req.user.sub) && (req.user.role != "ROLE_ADMIN")) {
        return res.status(500).send({ message: "No tienes permisos para actualizar los datos del usuario." })
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(500).send({ message: "El id es incorrecto" })     
    }

    User.findOne({_id: id}).exec().then(
        user => {
            if(!user){
                return res.status(404).send({ message: "No se ha podido encontrar el usuario" });
            }

            User.deleteOne({_id: user.id}).exec().then(
                data => {
                    if (data.deletedCount == 0) {
                        return res.status(404).send({ message: "No se ha podido eliminar el usuario" });
                    }
        
                    
                    return res.status(200).send({ data });
                }
            ).catch(
                err => {
                    return res.status(500).send({ message: "Error en la petición." + err })
                });
        }
    ).catch(
        err => {
            return res.status(500).send({ message: "Error en la petición." + err })
        }
    )

}


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}