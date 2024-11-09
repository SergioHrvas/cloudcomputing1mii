const mongoose = require('mongoose');
const chai = require('chai');
const app = require('../app'); // Ruta a tu archivo de aplicación Express
const chai_http = require('chai-http')
chai.use(chai_http);

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');


const expect = chai.expect;
describe("Habitantes", function () {
    var token = "";
    before(async () => {
        // Conéctate a la base de datos de prueba
        await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

        console.log("Conexión a la base de datos de prueba establecida");

        await mongoose.model('Inhabitant').deleteMany({});
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

        await mongoose.model('Zone').create({
            _id: "670f930a96f295c8503ade42",
            name:"Zona cerdos vietnamitas"
        })

        await mongoose.model('Specie').create({
            _id: "670f930a96f295c8503ade41",
            name: "Cerdo vietnamita"
        })

    });

    // Después de las pruebas, desconectarse de la base de datos
    after(async () => {

        await mongoose.disconnect();
    });


    describe('Obtener habitante', function () {

        it('Debería devolver 404 si no se encuentra el habitante', async () => {

            const res = await chai.request(app).get('/api/inhabitant/inhabitant/670f930a96f295c8503ade34').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('El habitante no existe');
        });

        it("Deberia devolver 200 si encuentra el habitante", async () => {


            await mongoose.model('Inhabitant').create({
                _id: "670f930a96f295c8503ade44",
                name: "Crespillo",
                description: "Cerdo vietnamita grande y negro",
                personality: "Travieso",
                image: "fotoCrespillo.png",
                birth: Date.parse("17 Jan 2023"),
                healthStatus: "Sano",
                vetVisits: [{
                    date: Date.parse("20 Feb 2023"),
                    reason: "Chequeo",  // Motivo de la visita
                    vetName: "Sandra"  // Nombre del veterinario
                  }],
                alive: true,
                specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42"
                
            });

            const res = await chai.request(app).get('/api/inhabitant/inhabitant/670f930a96f295c8503ade44').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('inhabitant').that.is.an('object');
            expect(res.body.inhabitant).to.have.property('name').that.equals('Crespillo');
            expect(res.body.inhabitant).to.have.property('description').that.equals('Cerdo vietnamita grande y negro');
            expect(res.body.inhabitant).to.have.property('image').that.equals('fotoCrespillo.png');
            expect(res.body.inhabitant).to.have.property('personality').that.equals("Travieso")


        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).get('/api/inhabitant/inhabitant/670f930a96f295c8503ade12s').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');
        });

        it('Debería devolver 500 si hay un problema con la base de datos', async () => {
            mongoose.disconnect();
            const res = await chai.request(app).get('/api/inhabitant/inhabitant/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error al obtener el habitante.');
        });



    });


    
    describe('Obtener lista de habitantes', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');


            await mongoose.model('Inhabitant').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si hay habitantes", async () => {
            await mongoose.model('Inhabitant').create({ name: 'Inhabitant 1',                 specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42" });
            await mongoose.model('Inhabitant').create({ name: 'Inhabitant 2',                 specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42" });
            await mongoose.model('Inhabitant').create({ name: 'Inhabitant 3',                 specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42" });

            const res = await chai.request(app).get('/api/inhabitant/list').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('inhabitants').that.is.an('array');
            expect(res.body.inhabitants).to.have.lengthOf(3);  // Debería haber tres habitantes
            expect(res.body.inhabitants[0]).to.have.property('name').that.is.an('string')
            expect(res.body.inhabitants[0]).to.have.property('name').that.equals("Inhabitant 1")
        })

        it("Debería devolver 404 si no hay habitantes", async () => {
            await mongoose.model('Inhabitant').deleteMany({});

            const res = await chai.request(app).get('/api/inhabitant/list').set('Authorization', token).send()
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals("No hay habitantes disponibles")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).get('/api/inhabitant/list').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error al obtener los habitantes.")
        })
    });

    
    describe('Obtener lista de habitantes por especie', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');


            await mongoose.model('Inhabitant').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si hay habitantes", async () => {
            await mongoose.model('Inhabitant').create({ name: 'Inhabitant 1',                 specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42" });
            await mongoose.model('Inhabitant').create({ name: 'Inhabitant 2',                 specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42" });

            const res = await chai.request(app).get('/api/inhabitant/list/specie/670f930a96f295c8503ade41').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('inhabitants').that.is.an('array');
            expect(res.body.inhabitants).to.have.lengthOf(2);  // Debería haber tres habitantes
            expect(res.body.inhabitants[0]).to.have.property('name').that.is.an('string')
            expect(res.body.inhabitants[0]).to.have.property('name').that.equals("Inhabitant 1")
        })

        it("Debería devolver 404 si no hay habitantes", async () => {
            await mongoose.model('Inhabitant').deleteMany({});

            const res = await chai.request(app).get('/api/inhabitant/list/specie/670f930a96f295c8503ade41').set('Authorization', token).send()
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals("No hay habitantes disponibles")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).get('/api/inhabitant/list/specie/670f930a96f295c8503ade41').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error al obtener los habitantes.")
        })
    });

    describe('Modificar habitante', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('Inhabitant').deleteMany({});

        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha modificado", async () => {
            await mongoose.model('Inhabitant').create({
                _id: "670f930a96f295c8503ade12",
                name: "habitantePrueba",
                description: "descripcion de el habitante",
                image: "imagenHabitante.png",
                specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42"
            });


            var body = {
                name: "habitantePruebaModificada",
                description: "descripcion modificada de el habitante",
                image: "otraImagen.png",
            }

            const res = await chai.request(app).put('/api/inhabitant/update/670f930a96f295c8503ade12').set('Authorization', token).send(body)

            console.log("==========")
            console.log(res.body)
            console.log("==========")

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('inhabitant').that.is.an('object');
            expect(res.body.inhabitant).to.have.property('name').that.equals('habitantePruebaModificada');
            expect(res.body.inhabitant).to.have.property('description').that.equals('descripcion modificada de el habitante');
            expect(res.body.inhabitant).to.have.property('image').that.equals('otraImagen.png');
        })


        it("Deberia devolver 500 si ya están los datos", async () => {

            await mongoose.model('Inhabitant').create({
                _id: "670f930a96f295c8503ade45",
                name: "habitante1",
                specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42"
            });


            await mongoose.model('Inhabitant').create({
                name: "habitante2",
                specie: "670f930a96f295c8503ade41",
                zone: "670f930a96f295c8503ade42"
            });

            var body = {
                name: "habitante2",
                technical_name: "Nombre técnico",
            }


            const res = await chai.request(app).put('/api/inhabitant/update/670f930a96f295c8503ade45').set('Authorization', token).send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('Los datos ya están en uso');
        })


        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/inhabitant/update/670f930a96f295c8503ade12d').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("El id es incorrecto")

        });

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).put('/api/inhabitant/update/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error en la petición")
        })






    });
        /*
    describe('Crear habitante', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('Inhabitant').deleteMany({});

            body = {
                name: "Habitante creada",
                technical_name: "Nombre técnico",
                description: "Descripcion de la nueva habitante",
                diet: "Semillas",
                image: "imagenhabitante.png",
            }
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha creado el habitante", async () => {


            const res = await chai.request(app).post('/api/inhabitant/create').set('Authorization', token).send(body)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('inhabitant').that.is.an('object');
            expect(res.body.inhabitant).to.have.property('name').that.equals('Habitante creada');
            expect(res.body.inhabitant).to.have.property('technical_name').that.equals('Nombre técnico');
            expect(res.body.inhabitant).to.have.property('description').that.equals('Descripcion de la nueva habitante');
            expect(res.body.inhabitant).to.have.property('diet').that.equals('Semillas');
            expect(res.body.inhabitant).to.have.property('image').that.equals('imagenhabitante.png');

        })

        it("Debería devolver 400 si el nombre de el habitante está repetido", async () => {

            await mongoose.model('Inhabitant').create(
                {
                    name: "Habitante2",
                    technical_name: "Nombre técnico",
                }

            );

            body = {
                name: "Habitante2",
                technical_name: "Nombre técnico",
                description: "Descripcion de la nueva habitante",
                diet: "Semillas",
                image: "imagenhabitante.png",
            }

            const res = await chai.request(app).post('/api/inhabitant/create').set('Authorization', token).send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("Ya existe una habitante con ese nombre")
        })

        it("Debería devolver 400 si no se ha enviado algún dato obligatorio", async () => {

            body.name = undefined;


            const res = await chai.request(app).post('/api/inhabitant/create').set('Authorization', token).send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("El nombre es obligatorio")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).post('/api/inhabitant/create').set('Authorization', token).send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error en la petición")
        })



    });


    describe('Eliminar habitante', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('Inhabitant').deleteMany({});


            for (var i = 1; i <= 5; i++) {
                body = {
                    _id: "672d3811d845bd7eb841421" + i,
                    name: "Zona " + i,
                    description: "Zona para eliminar " + i,
                    image: "image" + i + ".png"
                }

                await mongoose.model('Inhabitant').create(body);
            }
        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha eliminado el habitante", async () => {
            const res = await chai.request(app).delete('/api/inhabitant/delete/672d3811d845bd7eb8414211').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data').that.is.an('object');
            expect(res.body.data).to.have.property('deletedCount').that.is.an('number');
            expect(res.body.data).to.have.property('deletedCount').that.equals(1);
        })

        it("Deberia devolver 404 si no se ha encontrado el habitante", async () => {
            const res = await chai.request(app).delete('/api/inhabitant/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('No se ha podido encontrar el habitante');

        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/inhabitant/update/670f930a96f295c8503ade12dss').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');


        });

        it("Deberia devolver 500 si hay un error con la base de datos", async () => {
            await mongoose.disconnect()

            const res = await chai.request(app).delete('/api/inhabitant/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error en la petición.');

        })



    });


    */

});