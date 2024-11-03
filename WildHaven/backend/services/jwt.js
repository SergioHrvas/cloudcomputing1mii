'use strict'

//Importamos jwt
import jwt from "jwt-simple";

//Importamos la libreria moment para generar fechas
import moment from "moment";

//Variable secret para tener un string secreto
var secret = "clave_secreta_curso123";

var createToken = function(user){

    //Datos del usuario que quiero codificar en mi token
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }
    
    return jwt.encode(payload, secret);

}

export default createToken