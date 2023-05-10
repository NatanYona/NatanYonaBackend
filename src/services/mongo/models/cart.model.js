const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    id: Number,
    productos: Array,
})

module.exports = mongoose.model('Cart', cartSchema);