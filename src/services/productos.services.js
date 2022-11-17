const fs = require ('fs');



let productos = [];
try {
    const data = fs.readFileSync('./productos.txt', 'utf-8');
    if(data != ''){
        productos = JSON.parse(data);
    }
} catch (err) {
    console.error(err)
}

class Productos{
    constructor(){}

    getProductos(){
        return productos
    }

    saveProductos(producto){
        productos.push(producto)
        fs.writeFileSync('./productos.txt', JSON.stringify(productos))
        return producto
    }
    deleteProductos(id){
        const producto = productos.find(i => i.id == id)
        productos.splice(producto, 1)
        fs.writeFileSync('./productos.txt', JSON.stringify(productos))
        return producto
    }
}



module.exports = Productos