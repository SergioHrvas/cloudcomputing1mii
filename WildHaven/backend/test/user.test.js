const mongoose = require('mongoose');

const UserController = require('../controllers/user.js');
const User = require('../models/user.js')
const chai = require('chai');
const app = require('../app'); // Ruta a tu archivo de aplicación Express
const chai_http = require('chai-http')
chai.use(chai_http);
const expect = chai.expect;
describe("Usuarios", function () {
    describe('Obtener usuario', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://localhost:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('User').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it('Debería devolver 404 si no se encuentra el usuario', async () => {
            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade12').send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('El usuario no existe');
        });

        it("Deberia devolver 200 si hay usuarios", async () => {
            await mongoose.model('User').create({
                _id: "670f930a96f295c8503ade1e",
                name: "Sergio",
                surname: "Hervas",
                email: "sergiohervas13@gmail.com",
                role: "ROLE_USER",
                image: null,
                created_at: "1729073930"
            });

            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade1e').send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user').that.is.an('object');
            expect(res.body.user).to.have.property('name').that.equals('Sergio');

        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade12d').send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');
        });

        it('Debería devolver 500 si hay un problema con la base de datos', async () => {
            mongoose.disconnect();
            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade12').send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('Error en la petición');
        });



    });



    describe('User API', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://localhost:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('User').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si hay usuarios", async () => {
            await mongoose.model('User').create({ name: 'User 1' });

            const res = await chai.request(app).get('/api/user/list').send()

            const body = res.body;

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('users').that.is.an('array');
            expect(res.body.users).to.have.lengthOf(1);  // Debería haber un usuario
            expect(res.body).to.have.property('total').that.is.a('number');
            expect(res.body.total).to.equal(1);  // Total de usuarios
            expect(res.body).to.have.property('pages').that.is.a('number');
        })

        it("Debería devolver 404 si no hay usuarios", async () => {
            await mongoose.model('User').deleteMany({});

            const res = await chai.request(app).get('/api/user/list').send()

            const body = res.body;

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals("No hay usuarios disponibles")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).get('/api/user/list').send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error en la petición")
        })
    });
});