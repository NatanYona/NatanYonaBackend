const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productosSchema = new Schema({
    id: String,
    nombre: String,
    precio: Number,
    thumbnail: String,
})

module.exports = mongoose.model('Productos', productosSchema);