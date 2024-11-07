'use strict'

//Importamos jwt
var jwt = require("jwt-simple");

//Importamos la libreria moment para generar fechas
var moment = require("moment");

//Variable secret para tener un string secreto
var secret = "clave_secreta_curso123";

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: "La petición no tiene la cabecera de autenticación."})
    }
    else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
    }

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: "El token ha expirado."})
    
        }
    }
    catch(ex){
        return res.status(404).send({message: "El token no es válido."})

    }

    //Adjuntmaos el payload a la request para tener en los controladores el objeto del usuario logeado.
    req.user = payload;
    //fin del middleware
    next();
}