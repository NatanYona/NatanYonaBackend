const express = require('express');
const router = express.Router();
const productsRoutes = require('./productsRoutes.js');
const cartRoutes = require('./cartRoutes.js');
const usersRoutes = require('./userRouter.js');


//endpoints
router.get('/health', (_req, res) => {
    res.json({
        status: 'UP',
        envierment: process.env.NODE_ENV ,
        PORT: process.env.PORT
    });
});

router.get('/ping', (_req, res) => {
    res.json({
        status: 'pong'
    });
});





//router uses


router.use('/users', usersRoutes)

router.use('/productos', productsRoutes);

router.use('/cart', cartRoutes);

















module.exports = router;