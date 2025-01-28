'use strict'

var express = require('express');
var SponsorshipController = require('../controllers/sponsorship');
var mdAuth = require('../middlewares/authenticated');

const requestLogger = require('../middlewares/logging');

var api = express.Router();

api.get('/pruebas', requestLogger, SponsorshipController.pruebas);
api.post('/sponsorship', [mdAuth.ensureAuth], SponsorshipController.createSponsorship);
api.get('/sponsorships', [mdAuth.ensureAuth], SponsorshipController.getSponsorships);
api.get('/sponsorship/:id', SponsorshipController.getSponsorship);
api.put('/sponsorship/:id', [mdAuth.ensureAuth], SponsorshipController.updateSponsorship);
api.delete('/sponsorship/:id', [mdAuth.ensureAuth], SponsorshipController.deleteSponsorship);


api.get('/mySponsorships', mdAuth.ensureAuth, SponsorshipController.getMySponsorships);
api.put('/finishSponsorship', mdAuth.ensureAuth, SponsorshipController.finishSponsorship);



module.exports = api;

