'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
const Sponsorship = new Schema({
    sponsor: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Padrino (Usuario)
    animal: { type: Schema.Types.ObjectId, ref: 'Inhabitant', required: true },  // Animal apadrinado
    startDate: { type: Date, default: Date.now },  // Fecha de inicio del apadrinamiento
    endDate: { type: Date },  // Fecha de finalización (si es temporal)
    contributionAmount: { type: Number, required: true },  // Monto de la contribución
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }  // Estado del apadrinamiento
  });

export {'Sponsorship', Sponsorship}