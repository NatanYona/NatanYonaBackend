const Cart = require('../services/mongo/models/cart.model.js')




class CartConstructor{
    constructor(){}

    createCart(userID){
        const newCart = new Cart({
            id: userID,
            productos: []
        })
        newCart.save()
        return newCart
    }


    updateCart(Producto, userID){
        const updateCart = new Cart({
            id: userID,
            productos: Producto
        })
        updateCart.save()
        return updateCart
    }

    deleteCart(userID){
        const deletedCart = Cart.findOneAndDelete({"id": {userID}})
        return deletedCart
    }




}

module.exports = CartConstructor;