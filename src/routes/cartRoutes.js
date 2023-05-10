const express = require('express');
const router = express.Router();
const CartConstructor = require('../services/cart.services.js');

router.get('/health', (_req, res) => {
    res.json({
        status: 'Cart UP',
        envierment: process.env.NODE_ENV ,
        PORT: process.env.PORT
    });
});

router.post('/create/:id', (req, res) => {
    const Cart = new CartConstructor();
    const userID = req.params.id;
    const newCart = Cart.createCart(userID);
    res.json(newCart);
});

router.put('/add/:id', (req, res) => {
    const Cart = new CartConstructor();
    const userID = req.params.id;
    const productoID = req.body.productoid;
    const updateCart = Cart.updateCart(productoID, userID);
    res.json("updateCart");
});


router.delete('/delete/:id', (req, res) => {
    const Cart = new CartConstructor();
    const userID = req.params.id;
    const deletedCart = Cart.deleteCart(userID);
    res.json({
        cart: "Deleted Cart",
    })
});


    

module.exports = router;