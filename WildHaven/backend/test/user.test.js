const mongoose = require('mongoose');
const chai = require('chai');
const app = require('../app'); // Ruta a tu archivo de aplicación Express
const chai_http = require('chai-http')
chai.use(chai_http);
const fs = require('fs');


//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');


const expect = chai.expect;
describe("Usuarios", function () {
    var token = "";
    var imagenes = []; 


    before(async () => {
        // Conéctate a la base de datos de prueba
        await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

        console.log("Conexión a la base de datos de prueba establecida");

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
        await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

        await mongoose.model('Inhabitant').deleteMany({});
        await mongoose.model('User').deleteMany({});
        await mongoose.model('Zone').deleteMany({});
        await mongoose.model('Specie').deleteMany({});
        
        for(var i = 0; i < imagenes.length; i++){
            var imagePath = 'uploads/users/' + imagenes[i]
            fs.unlinkSync(imagePath)
        }
        
        await mongoose.disconnect();
    });


    describe('Obtener usuario', function () {

        it('Debería devolver 404 si no se encuentra el usuario', async () => {

            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('El usuario no existe');
        });

        it("Deberia devolver 200 si encuentra el usuario", async () => {
            await mongoose.model('User').create({
                _id: "670f930a96f295c8503ade1e",
                name: "Sergio",
                surname: "Hervas",
                email: "sergiohervas13@gmail.com",
                role: "ROLE_USER",
                image: null,
            });

            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade1e').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user').that.is.an('object');
            expect(res.body.user).to.have.property('name').that.equals('Sergio');

        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade12d').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');
        });

        it('Debería devolver 500 si hay un problema con la base de datos', async () => {
            mongoose.disconnect();
            const res = await chai.request(app).get('/api/user/user/670f930a96f295c8503ade12').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('Error en la petición');
        });



    });

    describe('Obtener lista de usuarios', function () {
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('User').deleteMany({});
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si hay usuarios", async () => {
            await mongoose.model('User').create({ name: 'User 1' });

            const res = await chai.request(app).get('/api/user/list').set('Authorization', token).send()

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

            const res = await chai.request(app).get('/api/user/list').set('Authorization', token).send()

            const body = res.body;

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals("No hay usuarios disponibles")
        })

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).get('/api/user/list').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error en la petición")
        })
    });

    describe('Modificar usuario', function () {
        var tokenupdate = "";
        var iduserupdated = "672d3811d845bd7eb8414810";

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('User').deleteMany({});

            var pass = await new Promise((resolve, reject) => {
                bcrypt.hash("update", null, null, function (err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                })
            })

            await mongoose.model('User').create({
                _id: iduserupdated,
                name: "Usuario",
                surname: "Update",
                email: "usuarioupdate@gmail.com",
                role: "ROLE_USER",
                password: pass
            });

            var req = {}
            req.body = {
                email: "usuarioupdate@gmail.com",
                password: "update",
                gettoken: true
            }

            const res = await chai.request(app).post('/api/user/login').send(req.body)

            tokenupdate = res.body.token;
        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha modificado", async () => {

            var body = {
                email: "emailcambiado@gmail.com",
                name: "nombrecambiado",
                surname: "apellidocambiado"
            }

            const res = await chai.request(app).put('/api/user/updateProfile/' + iduserupdated).set('Authorization', tokenupdate).field('email', body.email).field('surname', body.surname).field('name', body.name).attach('image', 
                fs.readFileSync('test/test.png'), 'test.png');
            
            imagenes.push(res.body.user.image)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user').that.is.an('object');
            expect(res.body.user).to.have.property('email').that.equals('emailcambiado@gmail.com');
            expect(res.body.user).to.have.property('name').that.equals('nombrecambiado');
            expect(res.body.user).to.have.property('surname').that.equals('apellidocambiado');
        })


        it("Deberia devolver 403 si no permite la edición del usuario", async () => {

            const res = await chai.request(app).put('/api/user/updateProfile/' + iduserupdated).set('Authorization', token).send()

            expect(res).to.have.status(403);
            expect(res.body).to.have.property('message').that.equals('No tienes permisos para actualizar los datos del usuario.');
        })

        /* it("Debería devolver 404 si no se ha podido modificar el usuario", async () => {
             var body = {
                 email: "emailcambiado@gmail.com",
                 name: "nombrecambiado",
                 surname: "apellidocambiado"
             }
 
             const res = await chai.request(app).put('/api/user/update/670f930a96f295c8503ade10').set('Authorization', tokenupdate).send(body)
 
             expect(res).to.have.status(404);
             expect(res.body).to.have.property('message').that.equals("No se ha podido actualizar el usuario")
         })*/

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/user/updateProfile/670f930a96f295c8503ade12d').set('Authorization', tokenupdate).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("El id es incorrecto")

        });

        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).put('/api/user/updateProfile/' + iduserupdated).set('Authorization', tokenupdate).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals("Error en la petición")
        })






    });

    describe('Crear usuario', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('User').deleteMany({});

            body = {
                name: "Usuario",
                surname: "Creado",
                email: "usuariocreado@gmail.com",
                role: "ROLE_USER",
                password: "password"
            }
        });

        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha registrado el usuario", async () => {


            const res = await chai.request(app).post('/api/user/register').send(body)


            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user').that.is.an('object');
            expect(res.body.user).to.have.property('email').that.equals('usuariocreado@gmail.com');
            expect(res.body.user).to.have.property('name').that.equals('Usuario');
            expect(res.body.user).to.have.property('surname').that.equals('Creado');
            expect(res.body.user).to.have.property('role').that.equals('ROLE_USER');

        })

        it("Debería devolver 400 si el correo está repetido", async () => {

            await mongoose.model('User').create(
                {
                    name: "Usuario",
                    surname: "Creado",
                    email: "usuariocreado@gmail.com",
                    role: "ROLE_USER",
                    image: "image.png",
                    password: "password"
                }

            );

            const res = await chai.request(app).post('/api/user/register').send(body)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("Ya existe un usuario con ese correo electrónico")
        })

        it("Debería devolver 400 si no se ha enviado algún dato obligatorio", async () => {

            var nuevobody = {...body}
            nuevobody.email = undefined;


            const res = await chai.request(app).post('/api/user/register').send(nuevobody)

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals("Envía todos los campos obligatorios.")
        })
        
        it("Debería devolver 500 si hay un error con la base de datos", async () => {
            // Desconectamos la base de datos para simular un error de conexión
            await mongoose.disconnect();
            const res = await chai.request(app).post('/api/user/register').send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes("Error en la petición de registro")
        })


    });


    describe('Eliminar usuario', function () {
        var body = {}

        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('User').deleteMany({});


            for (var i = 1; i <= 5; i++) {
                body = {
                    _id: "672d3811d845bd7eb841421" + i,
                    name: "Usuario",
                    surname: "Eliminar" + i,
                    email: "usuarioeliminado" + i + "@gmail.com",
                    role: "ROLE_USER",
                    password: "password"
                }

                await mongoose.model('User').create(body);
            }
        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha eliminado el usuario", async () => {
            const res = await chai.request(app).delete('/api/user/delete/672d3811d845bd7eb8414211').set('Authorization', token).send()

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data').that.is.an('object');
            expect(res.body.data).to.have.property('deletedCount').that.is.an('number');
            expect(res.body.data).to.have.property('deletedCount').that.equals(1);
        })

        it("Deberia devolver 404 si no se ha encontrado el usuario", async () => {
            const res = await chai.request(app).delete('/api/user/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('No se ha podido encontrar el usuario');

        })

        it('Debería devolver 500 si el id no es válido', async () => {
            const res = await chai.request(app).put('/api/user/update/670f930a96f295c8503ade12dss').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.equals('El id es incorrecto');


        });

        it("Deberia devolver 500 si hay un error con la base de datos", async () => {
            await mongoose.disconnect()

            const res = await chai.request(app).delete('/api/user/delete/672d3811d845bd7eb8414220').set('Authorization', token).send()

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error en la petición.');

        })



    });


    describe('Login de usuario', function () {
        var body = {}
        before(async () => {
            // Conéctate a la base de datos de prueba
            await mongoose.connect('mongodb://0.0.0.0:27017/wildhaven-test');

            await mongoose.model('User').deleteMany({});

            var pass = await new Promise((resolve, reject) => {
                bcrypt.hash("password", null, null, function (err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                })
            })

            body = {
                name: "Usuario",
                surname: "Login",
                email: "usuariologin@gmail.com",
                role: "ROLE_USER",
                password: pass
            }

            await mongoose.model('User').create(body);
            
        });


        // Después de las pruebas, desconectarse de la base de datos
        after(async () => {
            await mongoose.disconnect();
        });

        it("Deberia devolver 200 si se ha logueado el usuario", async () => {

            body = { 
                email: "usuariologin@gmail.com",
                password: "password"
            }


            const res = await chai.request(app).post('/api/user/login/').send(body)

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user').that.is.an('object');
            expect(res.body.user).to.have.property('name').that.equals('Usuario');
            expect(res.body.user).to.have.property('surname').that.equals('Login');
            expect(res.body.user).to.have.property('email').that.equals('usuariologin@gmail.com');
            expect(res.body.user).to.have.property('role').that.equals('ROLE_USER');

        })

        it("Deberia devolver 404 si no se ha encontrado el usuario", async () => {
            body = { 
                email: "usuariologin2@gmail.com",
                password: "passwords"
            }

            const res = await chai.request(app).post('/api/user/login/').send(body)


            
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('No se ha podido encontrar el usuario.');

        })

        it('Debería devolver 404 si la contraseña no es válida', async () => {
            body = { 
                email: "usuariologin@gmail.com",
                password: "passwords"
            }

            const res = await chai.request(app).post('/api/user/login/').send(body)

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message').that.equals('El usuario no se ha podido identificar.');


        });

        it("Deberia devolver 500 si hay un error con la base de datos", async () => {
            await mongoose.disconnect()

            const res = await chai.request(app).post('/api/user/login/').send(body)

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message').that.includes('Error en la petición.');

        })
    });
});