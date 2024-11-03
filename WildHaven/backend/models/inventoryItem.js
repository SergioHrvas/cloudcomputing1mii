'use strict'

//Cargamos el módulo de mongoose
import mongoose from 'mongoose';
var Schema = mongoose.Schema;


//Definimos el esquema
const inventoryItem = new Schema({
  name: { type: String, required: true },  // Nombre del artículo (ej: "Comida para cerdos", "Vacuna")
  category: { type: String, enum: ['Comida', 'Medicamentos', 'Suministros', 'Herramientas'], required: true },  // Categoría del artículo
  quantity: { type: Number, required: true },  // Cantidad disponible en stock
  unit: { type: String, required: true },  // Unidad de medida (ej: "kg", "litros", "unidades")
  description: { type: String },  // Descripción del artículo
  expirationDate: { type: Date },  // Fecha de caducidad (si aplica, para alimentos o medicamentos)
});

//exportamos el esquema
export default mongoose.model('inventoryItem', inventoryItem);