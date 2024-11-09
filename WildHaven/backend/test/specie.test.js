const mongoose = require('mongoose');
const chai = require('chai');
const app = require('../app'); // Ruta a tu archivo de aplicación Express
const chai_http = require('chai-http')
chai.use(chai_http);

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');


const expect = chai.expect;
describe("Especies", function () {
    var token = "";
    before(async () => {
        // Conéctate a la base de datos de prueba
        await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

        console.log("Conexión a la base de datos de prueba establecida");

        await mongoose.model('Specie').deleteMany({});
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


    describe('Obtener especie', function () {

        it('Debería devolver 404 si no se encuentra la especie', async () => {

            const res = await chai.request(app).get('/api/specie/specie/670f930a96f295c8503ade34').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('La especie no existe');
        });

        it("Deberia devolver 200 si encuentra la especie", async () => {
            await mongoose.model('Specie').create({
                _id: "670f930a96f295c8503ade44",
                name: "especiePrueba",
                description: "descripcion de la especie",
                image: "imagenEspecie.png",
            });

            const res = await chai.request(app).get('/api/specie/specie/670f930a96f295c8503ade44').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('specie').that.is.an('object');
            expect(res.body.specie).to.have.property('name').that.equals('especiePrueba');
            expect(res.body.specie).to.have.property('description').that.equals('descripcion de la especie');
            expect(res.body.specie).to.have.property('image').that.equals('imagenEspecie.png');


        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).get('/api/specie/specie/670f930a96f295c8503ade12s').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');
        });

        it('Debería devolver 500 si hay un problema con la base de datos', async () => {
            mongoose.disconnect();
            const res = await chai.request(app).get('/api/specie/specie/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error al obtener la especie.');
        });



    });

    describe('Obtener lista de especies', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');


            await mongoose.model('Specie').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si hay especies", async () => {
            await mongoose.model('Specie').create({ name: 'Specie 1' });
            await mongoose.model('Specie').create({ name: 'Specie 2' });
            await mongoose.model('Specie').create({ name: 'Specie 3' });

            const res = await chai.request(app).get('/api/specie/list').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('species').that.is.an('array');
            expect(res.body.species).to.have.lengthOf(3);  // Debería haber tres especies
            expect(res.body.species[0]).to.have.property('name').that.is.an('string')
            expect(res.body.species[0]).to.have.property('name').that.equals("Specie 1")
        })

        it("Debería devolver 404 si no hay especies", async () => {
            await mongoose.model('Specie').deleteMany({});

            const res = await chai.request(app).get('/api/specie/list').set('Authorization', token).send()
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals("No hay especies disponibles")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).get('/api/specie/list').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error al obtener las especies.")
        })
    });

    describe('Modificar especie', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('Specie').deleteMany({});

        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha modificado", async () => {
            await mongoose.model('Specie').create({
                _id: "670f930a96f295c8503ade12",
                name: "especiePrueba",
                description: "descripcion de la especie",
                image: "imagenEspecie.png",
            });


            var body = {
                name: "especiePruebaModificada",
                description: "descripcion modificada de la especie",
                image: "otraImagen.png",
            }

            const res = await chai.request(app).put('/api/specie/update/670f930a96f295c8503ade12').set('Authorization', token).send(body)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('specie').that.is.an('object');
            expect(res.body.specie).to.have.property('name').that.equals('especiePruebaModificada');
            expect(res.body.specie).to.have.property('description').that.equals('descripcion modificada de la especie');
            expect(res.body.specie).to.have.property('image').that.equals('otraImagen.png');
        })


        it("Deberia devolver 500 si ya están los datos", async () => {

            await mongoose.model('Specie').create({
                _id: "670f930a96f295c8503ade45",
                name: "especie1",
            });


            await mongoose.model('Specie').create({
                name: "especie2",
            });

            var body = {
                name: "especie2",
                technical_name: "Nombre técnico",
            }


            const res = await chai.request(app).put('/api/specie/update/670f930a96f295c8503ade45').set('Authorization', token).send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('Los datos ya están en uso');
        })


        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/specie/update/670f930a96f295c8503ade12d').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("El id es incorrecto")

        });

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).put('/api/specie/update/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error en la petición")
        })






    });

    describe('Crear especie', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('Specie').deleteMany({});

            body = {
                name: "Especie creada",
                technical_name: "Nombre técnico",
                description: "Descripcion de la nueva especie",
                diet: "Semillas",
                image: "imagenespecie.png",
            }
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha creado la especie", async () => {


            const res = await chai.request(app).post('/api/specie/create').set('Authorization', token).send(body)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('specie').that.is.an('object');
            expect(res.body.specie).to.have.property('name').that.equals('Especie creada');
            expect(res.body.specie).to.have.property('technical_name').that.equals('Nombre técnico');
            expect(res.body.specie).to.have.property('description').that.equals('Descripcion de la nueva especie');
            expect(res.body.specie).to.have.property('diet').that.equals('Semillas');
            expect(res.body.specie).to.have.property('image').that.equals('imagenespecie.png');

        })

        it("Debería devolver 400 si el nombre de la especie está repetido", async () => {

            await mongoose.model('Specie').create(
                {
                    name: "Especie2",
                    technical_name: "Nombre técnico",
                }

            );

            body = {
                name: "Especie2",
                technical_name: "Nombre técnico",
                description: "Descripcion de la nueva especie",
                diet: "Semillas",
                image: "imagenespecie.png",
            }

            const res = await chai.request(app).post('/api/specie/create').set('Authorization', token).send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("Ya existe una especie con ese nombre")
        })

        it("Debería devolver 400 si no se ha enviado algún dato obligatorio", async () => {

            body.name = undefined;


            const res = await chai.request(app).post('/api/specie/create').set('Authorization', token).send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("El nombre es obligatorio")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).post('/api/specie/create').set('Authorization', token).send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error en la petición")
        })



    });


    describe('Eliminar especie', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            console.log("Conexión a la base de datos de prueba establecida");
            await mongoose.model('Specie').deleteMany({});


            for (var i = 1; i <= 5; i++) {
                body = {
                    _id: "672d3811d845bd7eb841421" + i,
                    name: "Especie " + i,
                    description: "Especie para eliminar " + i,
                    image: "image" + i + ".png"
                }

                await mongoose.model('Specie').create(body);
            }
        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha eliminado la especie", async () => {
            const res = await chai.request(app).delete('/api/specie/delete/672d3811d845bd7eb8414211').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data').that.is.an('object');
            expect(res.body.data).to.have.property('deletedCount').that.is.an('number');
            expect(res.body.data).to.have.property('deletedCount').that.equals(1);
        })

        it("Deberia devolver 404 si no se ha encontrado la especie", async () => {
            const res = await chai.request(app).delete('/api/specie/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('No se ha podido encontrar la especie');

        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/specie/update/670f930a96f295c8503ade12dss').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');


        });

        it("Deberia devolver 500 si hay un error con la base de datos", async () => {
            await mongoose.disconnect()

            const res = await chai.request(app).delete('/api/specie/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error en la petición.');

        })



    });


});