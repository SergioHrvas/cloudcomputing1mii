const mongoose = require('mongoose');
const chai = require('chai');
const app = require('../app'); // Ruta a tu archivo de aplicación Express
const chai_http = require('chai-http')
chai.use(chai_http);

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');


const expect = chai.expect;
describe("Zonas", function () {
    var token = "";
    before(async () => {
        // Conéctate a la base de datos de prueba
        await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

        console.log("Conexión a la base de datos de prueba establecida");

        await mongoose.model('Zone').deleteMany({});
        await mongoose.model('User').deleteMany({});
        var pass = await new Promise((resolve, reject) => {
            bcrypt.hash("admin", null, null, function (err, hash) {
                if (err) reject(err)
                resolve(hash)
            })
        })

        await mongoose.model('User').create({
            name: "Sergio",
            surname: "Hervas",
            email: "sergiohcobo@correo.ugr.es",
            role: "ROLE_ADMIN",
            image: null,
            password: pass
        });


        var req = {}
        req.body = {
            email: "sergiohcobo@correo.ugr.es",
            password: "admin",
            gettoken: true
        }

        const res = await chai.request(app).post('/api/user/login').send(req.body)

        token = res.body.token;

    });

    // Después de las pruebas, desconectarse de la base de datos
    after(async () => {

        await mongoose.disconnect();
    });


    describe('Obtener zona', function () {

        it('Debería devolver 404 si no se encuentra la zona', async () => {

            const res = await chai.request(app).get('/api/zone/zone/670f930a96f295c8503ade34').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('La zona no existe');
        });

        it("Deberia devolver 200 si encuentra la zona", async () => {
            await mongoose.model('Zone').create({
                _id: "670f930a96f295c8503ade44",
                name: "zonaPrueba",
                description: "descripcion de la zona",
                image: "imagenZona.png",
            });

            const res = await chai.request(app).get('/api/zone/zone/670f930a96f295c8503ade44').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('zone').that.is.an('object');
            expect(res.body.zone).to.have.property('name').that.equals('zonaPrueba');
            expect(res.body.zone).to.have.property('description').that.equals('descripcion de la zona');
            expect(res.body.zone).to.have.property('image').that.equals('imagenZona.png');


        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).get('/api/zone/zone/670f930a96f295c8503ade12s').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');
        });

        it('Debería devolver 500 si hay un problema con la base de datos', async () => {
            mongoose.disconnect();
            const res = await chai.request(app).get('/api/zone/zone/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('Error en la petición.');
        });



    });

    describe('Obtener lista de zonas', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');


            await mongoose.model('Zone').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si hay zonas", async () => {
            await mongoose.model('Zone').create({ name: 'Zone 1' });
            await mongoose.model('Zone').create({ name: 'Zone 2' });

            const res = await chai.request(app).get('/api/zone/list').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('zones').that.is.an('array');
            expect(res.body.zones).to.have.lengthOf(2);  // Debería haber dos zonas
            expect(res.body.zones[0]).to.have.property('name').that.is.an('string')
            expect(res.body.zones[0]).to.have.property('name').that.equals("Zone 1")
        })

        it("Debería devolver 404 si no hay zonas", async () => {
            await mongoose.model('Zone').deleteMany({});

            const res = await chai.request(app).get('/api/zone/list').set('Authorization', token).send()
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals("No hay zonas disponibles")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).get('/api/zone/list').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error al obtener las zonas.")
        })
    });

    describe('Modificar zona', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('Zone').deleteMany({});

        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha modificado", async () => {
            await mongoose.model('Zone').create({
                _id: "670f930a96f295c8503ade12",
                name: "zonaPrueba",
                description: "descripcion de la zona",
                image: "imagenZona.png",
            });


            var body = {
                name: "zonaPruebaModificada",
                description: "descripcion modificada de la zona",
                image: "otraImagen.png",
            }

            const res = await chai.request(app).put('/api/zone/update/670f930a96f295c8503ade12').set('Authorization', token).send(body)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('zone').that.is.an('object');
            expect(res.body.zone).to.have.property('name').that.equals('zonaPruebaModificada');
            expect(res.body.zone).to.have.property('description').that.equals('descripcion modificada de la zona');
            expect(res.body.zone).to.have.property('image').that.equals('otraImagen.png');
        })


        it("Deberia devolver 500 si ya están los datos", async () => {

            await mongoose.model('Zone').create({
                _id: "670f930a96f295c8503ade45",
                name: "zona1",
            });


            await mongoose.model('Zone').create({
                name: "zona2",
            });

            var body = {
                name: "zona2",
                description: "descripcion modificada de la zona",
                image: "otraImagen.png",
            }


            const res = await chai.request(app).put('/api/zone/update/670f930a96f295c8503ade45').set('Authorization', token).send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('Los datos ya están en uso');
        })


        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/zone/update/670f930a96f295c8503ade12d').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("El id es incorrecto")

        });

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).put('/api/zone/update/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error en la petición")
        })






    });

    describe('Crear zona', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('Zone').deleteMany({});

            body = {
                name: "Zona creada",
                description: "Descripción de la zona creada",
                image: 'zonaimage.png'
            }
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha creado la zona", async () => {


            const res = await chai.request(app).post('/api/zone/create').set('Authorization', token).send(body)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('zone').that.is.an('object');
            expect(res.body.zone).to.have.property('name').that.equals('Zona creada');
            expect(res.body.zone).to.have.property('description').that.equals('Descripción de la zona creada');
            expect(res.body.zone).to.have.property('image').that.equals('zonaimage.png');

        })

        it("Debería devolver 400 si el nombre de la zona está repetido", async () => {

            await mongoose.model('Zone').create(
                {
                    name: "Zona creada",
                    description: "Descripción de otra zona creada",
                    image: 'foto.png'
                }
            );

            const res = await chai.request(app).post('/api/zone/create').set('Authorization', token).send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("Ya existe una zona con ese nombre")
        })

        it("Debería devolver 400 si no se ha enviado algún dato obligatorio", async () => {

            body.name = undefined;


            const res = await chai.request(app).post('/api/zone/create').set('Authorization', token).send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("El nombre es obligatorio")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).post('/api/zone/create').set('Authorization', token).send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error al crear la zona")
        })



    });


    describe('Eliminar zona', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('Zone').deleteMany({});


            for (var i = 1; i <= 5; i++) {
                body = {
                    _id: "672d3811d845bd7eb841421" + i,
                    name: "Zona " + i,
                    description: "Zona para eliminar " + i,
                    image: "image" + i + ".png"
                }

                await mongoose.model('Zone').create(body);
            }
        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha eliminado la zona", async () => {
            const res = await chai.request(app).delete('/api/zone/delete/672d3811d845bd7eb8414211').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data').that.is.an('object');
            expect(res.body.data).to.have.property('deletedCount').that.is.an('number');
            expect(res.body.data).to.have.property('deletedCount').that.equals(1);
        })

        it("Deberia devolver 404 si no se ha encontrado la zona", async () => {
            const res = await chai.request(app).delete('/api/zone/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('No se ha podido encontrar la zona');

        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/zone/update/670f930a96f295c8503ade12dss').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');


        });

        it("Deberia devolver 500 si hay un error con la base de datos", async () => {
            await mongoose.disconnect()

            const res = await chai.request(app).delete('/api/zone/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error en la petición.');

        })



    });


});