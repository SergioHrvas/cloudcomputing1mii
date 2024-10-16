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


function pruebas(req, res){
    res.status(200).send({
        message:"Acción de usuarios en el servidor de NodeJS"
    })
};


//Registro de usuario
function saveUser(req, res){
    //Recogemos los parámetros de la request
    var params = req.body;

    //Creamos una instancia/objeto de usuario (de su modelo)
    var user = new User();

    if(params.name && params.surname && params.password && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = null;
        user.created_at = moment().unix();

        User.find({email: user.email.toLowerCase()}).exec().then(users => {
            if(users && users.length > 0){
                return res.status(200).send({message: "Ya existe un usuario con ese correo electrónico"});
            }
            else{
                        //Encriptamos la contraseña
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            //Guardamos el usuario
            user.save().then(userStored => {
                //Si se ha guardado, devuelvo el usuario
                userStored.password = undefined;
                if(userStored){
                    res.status(200).send({user: userStored});
                }else{
                    res.status(404).send({message: "No se ha registrado el usuario"}); 
                }
            }).catch(err => {
                if(err) return res.status(500).send({message: "Error al guardar el usuario."})
            })

        });
            }


        }).catch(err => {
            if(err) return res.status(500).send({message: "Error en la petición de usuarios"});
        })

    }
    else{
        res.status(200).send({
            message: "Envía todos los campos obligatorios."
        })
    }
}

//Login de usuario
function loginUser(req, res){
    //Recogemos los parámetros del body
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email}).exec().then( 
        user => {
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check){
                        //Devuelvo los datos del usuario
                        if(params.gettoken){
                            //devolver token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            user.password = undefined;
                            return res.status(200).send({user});
                        }

                    }   
                    else{
                        return res.status(404).send({message: "El usuario no se ha podido identificar."});
                    }
                })
            }
            else{
                return res.status(404).send({message: "El usuario no se ha podido identificar."});
            }
        }

    ).catch(
        err => {
            return res.status(500).send({message: "Error en la petición."});
        } 
    )
}



module.exports = {
    pruebas,
    saveUser,
    loginUser
}