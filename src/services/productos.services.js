const uuidv4 = require('uuid').v4;
const Productos = require('../services/mongo/models/productos.model.js');


let productos = []




class ProductosConstructor{
    constructor(){}

    saveProductos(producto){
        const newProducto = new Productos({
            id: uuidv4(),
            nombre: producto.nombre,
            precio: producto.precio,
            thumbnail: producto.thumbnail,
        })
        newProducto.save()
        return newProducto
    }


    /* use findOneandUpdate to make updateProducto */
    updateProducto(id, producto){
        const updateProducto = Productos.findOneAndUpdate(id, producto)
        return updateProducto
    }


    
    deleteProducto(id){
        const deleteProducto = Productos.findOneAndDelete({"id": id})
        /* add delay to updatedatabase and then return fuction */
        return deleteProducto
    }

    
}




module.exports = ProductosConstructor;