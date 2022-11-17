const fs = require ('fs');

let cartProductos = [];
try {
    const data = fs.readFileSync('./cart.txt', 'utf-8');
    if(data != ''){
        cartProductos = JSON.parse(data);
    }
} catch (err) {
    console.error(err)
}

class Cart{
    constructor(){}

    getCart(){
        return cartProductos
    }

    saveCart(producto){
        cartProductos.push(producto)
        fs.writeFileSync('./cart.txt', JSON.stringify(cartProductos))
        return producto
    }
    deleteCart(id){
        const producto = cartProductos.find(i => i.id == id)
        cartProductos.splice(producto, 1)
        fs.writeFileSync('./cart.txt', JSON.stringify(cartProductos))
        return producto
    }
}


module.exports = Cart