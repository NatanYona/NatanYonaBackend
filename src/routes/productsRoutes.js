const express = require('express');
const router = express.Router();
const ProductosConstructor = require('../services/productos.services.js');
const productosModel = require('../services/mongo/models/productos.model.js');


//endpoints

router.get('/health', (_req, res) => {
    res.json({
        status: 'Products UP',
        envierment: process.env.NODE_ENV ,
        PORT: process.env.PORT
    });
});

/* get products list from mongoAtlas db */
router.get('/list', (_req, res) => {
    productosModel.find()
    .then((data) => {
        res.json(data);
    }
    )
});


router.post('/save',  async (req, res) => {
    const Produ = new ProductosConstructor();
    const newProducto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        thumbnail: req.body.thumbnail,
    }
    console.log(newProducto);
    await Produ.saveProductos(newProducto);
    res.json(newProducto);
});


router.put('/update/:id', async (req, res) => {
    const Produ = new ProductosConstructor();
    const id = req.params.id;
    const newProducto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        thumbnail: req.body.thumbnail,
    }
    await Produ.updateProducto(id, newProducto);
    res.json(newProducto);
});

router.delete('/delete/:id', async (req, res) => {
    const Produ = new ProductosConstructor();
    const id = req.params.id;
    await Produ.deleteProducto(id);
    res.json({message: 'Producto eliminado'});
});


router.get('/list/:id', (req, res) => {
    const id = req.params.id;
    productosModel.findOne({"id": id})
    .then((data) => {
        res.json(data);
    }
    )
});








module.exports = router;