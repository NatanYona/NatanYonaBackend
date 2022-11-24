const knexConfig = require('./database/config.js');
const knex = require('knex')(knexConfig);

const productos = []

class Productos{
    constructor(){}

    getProductos(){
        return productos
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