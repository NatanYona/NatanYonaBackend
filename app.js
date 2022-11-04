const express = require('express')
const _ = require('lodash')
require('dotenv').config()
const Productos = require("./src/services/productos.services")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', "./views")
app.set('view engine', 'ejs')

app.get('/health', (_req, res)=>{       
    res.status(200).json({
        success: true,
        enviroment: process.env.ENVIRONMENT || "not found",
        health: "up"
    })
})

app.get('/ping', (_req, res)=>{
    res.status(200).json({
        ping: "PONG"
    })
})

// //


app.get('/productos', (_req, res)=>{
    const productos = new Productos()
    res.render('./pages/index', {productos: productos.getProductos()})
})

app.post('/productos' , (req, res)=>{
    const {name, price, thumbnail} = req.body;
    const productos = new Productos()
    productos.saveProductos({name, price, thumbnail})
    res.redirect('/productos');
})



module.exports = app