import { expect } from 'chai';
import UserController from '../controllers/user.js'; // Asegúrate de que esta importación sea correcta
import User from '../models/user.js';

// Mock del modelo User
const mockUserDB = {
    '6712d80816aa91e32686633d': { _id: '6712d80816aa91e32686633d', name: 'John Doe' }
};





// Reemplazamos el método findById de User para que devuelva nuestro mock
User.findById = (id) => {
    return {
        exec: () => {
            return new Promise((resolve) => {
                resolve(mockUserDB[id] || null); // Devuelve el usuario o null si no existe
            });
        }
    };
};

describe('Pruebas para la función getUser', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {} };
        res = {
            status: (statusCode) => {
                res.statusCode = statusCode;
                return res;
            },
            send: (body) => {
                res.body = body;
                return res;
            },
        };
    });

    it('debería devolver un usuario si el ID es válido', async () => {
        req.params.id = '6712d80816aa91e32686633d'; // ID válido

        await UserController.getUser(req, res);

        // Afirmaciones
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.deep.equal({ user: mockUserDB['6712d80816aa91e32686633d'] });
    });

    it('debería devolver un error si el ID es inválido', async () => {
        req.params.id = 'invalid_id'; // ID inválido

        await UserController.getUser(req, res);

        // Afirmaciones
        expect(res.statusCode).to.equal(500);
        expect(res.body).to.deep.equal({ message: "El id es incorrecto" });
    });

    it('debería devolver un error si el usuario no existe', async () => {
        req.params.id = '5712d80816aa91e32686633f'; // ID que no existe en nuestro mock

        await UserController.getUser(req, res);

        // Afirmaciones
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.deep.equal({ message: "El usuario no existe" });
    });

    
});