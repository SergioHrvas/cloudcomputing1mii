'use strict';

import jwt from 'jwt-simple';
import moment from 'moment';

const secret = "clave_secreta_curso123";

const ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "La petición no tiene la cabecera de autenticación." });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
    }

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "El token ha expirado." });
        }
    } catch (ex) {
        return res.status(404).send({ message: "El token no es válido." });
    }

    req.user = payload;
    next();
};

export default ensureAuth;  // Exportación por defecto
