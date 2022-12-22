const knexConfig = require('./database/config.js');
const knex = require('knex')(knexConfig);
const {faker} = require('@faker-js/faker');

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

    saveProductos(producto){
        productos.push(producto)
        knex('products').insert(producto).then(()=> {
            console.info('product saved')
        }).catch(err =>{
            console.error(err)
        }).finally(() =>{
            knex.destroy();
        });
        return producto
    }
}

module.exports = Productos