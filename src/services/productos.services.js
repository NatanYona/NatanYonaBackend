const mongoose = require('mongoose');
const {faker} = require('@faker-js/faker');
const uuidv4 = require('uuid').v4;

const productos = []


class Productos{
    constructor(){}

    getProductos(){
        return productos
    }

    generateProductos(){
        const responseArray = []
        for (let i = 0; i < 5; i++) {
            responseArray.push({
                id: i,
                title: faker.commerce.product(),
                price: faker.commerce.price(),
                thumbnail: faker.image.avatar()
            })
        }
        return responseArray
    }
//make a query to save the product in the database mongodb with mongoose

    saveProductos(producto){
        const productosSchema = new mongoose.Schema({
            id: String,
            nombre: String,
            precio: Number,
            thumbnail: String,
        })
        const Productos = mongoose.model('Productos', productosSchema)
        const newProducto = new Productos({
            id: uuidv4(),
            nombre: producto.name,
            precio: producto.price,
            thumbnail: producto.thumbnail,
        })
        newProducto.save()
        return newProducto
    }
}


module.exports = Productos