'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
const inventoryMovementSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },  // Referencia al artículo del inventario
    type: { type: String, enum: ['entrada', 'salida'], required: true },  // Tipo de movimiento (entrada o salida)
    quantity: { type: Number, required: true },  // Cantidad añadida o retirada
    date: { type: Date, default: Date.now },  // Fecha del movimiento
    responsibleUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Usuario responsable del movimiento
    reason: { type: String },  // Motivo del uso (ej: "Alimentación de cerdos", "Tratamiento de animales")
  });

  //exportamos el esquema
module.exports = mongoose.model('inventoryMovementSchema', inventoryMovementSchema);