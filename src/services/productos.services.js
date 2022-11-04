const productos = []

class Productos{
    constructor(){}

    getProductos(){
        return productos
    }

    saveProductos(producto){
        productos.push(producto)
        return producto
    }
}

module.exports = Productos