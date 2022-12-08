const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/health', (_req, res)=>{       
    res.status(200).json({
        success: true,
        enviroment: process.env.ENVIRONMENT || "not found",
        health: "up"
    })
})

app.get('/ping', (_req, res)=>{
    res.status(200).json({
        success: true,
        message: "pong"
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin SDK initialized");


//get all products
app.get('/productos', async (_req, res) => {
    const db = admin.firestore();
    const docRef = db.collection('productos')
    const doc = await docRef.get();
    const productos = doc.docs.map(doc => doc.data());
    productos.forEach((producto, index) => {
        producto.id = doc.docs[index].id;
    });
    res.render('./pages/index', {productos: productos})
});

//get product by id
app.get('/productos/:id', async (req, res) => {
    const {id} = req.params;
    const db = admin.firestore();
    const docRef = db.collection('productos').doc(id);
    const doc = await docRef.get();
    const producto = doc.data();
    res.json(producto)
});

//carrito

//get all products in carrito
app.get('/carrito', async (_req, res) => {
    const db = admin.firestore();
    const docRef = db.collection('carrito')
    const doc = await docRef.get();
    const carrito = doc.docs.map(doc => doc.data());
    res.json(carrito)
});

//add procutos to carrito
app.post('/carrito/:id', async (req, res) => {
    const {id} = req.params;
    const db = admin.firestore();
    const docRef = db.collection('productos').doc(id);
    const doc = await docRef.get();
    const producto = doc.data();
    const carritoRef = db.collection('carrito');
    const carrito = await carritoRef.add(producto);
    res.json(carrito)
});

//delete product from carrito

app.delete('/carrito/:id', async (req, res) => {
    const {id} = req.params;
    const db = admin.firestore();
    const docRef = db.collection('carrito').doc(id);
    const doc = await docRef.delete();
    res.json(doc)
});