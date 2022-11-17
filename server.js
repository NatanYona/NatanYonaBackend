const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IoServer} = require('socket.io');
const Productos = require('./src/services/productos.services');
const Cart = require('./src/services/cart.services');
require('dotenv').config();

const messages = [];

const app = express();

const http = new HttpServer(app);

const io = new IoServer(http);

app.use(express.static(__dirname + '/public'));

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

/// /Productos

//get
app.get('/productos', (_req, res)=>{
    const productos = new Productos()
    res.render('./pages/index', {productos: productos.getProductos()})
})

app.get('/productos', (_req, res) => {
    res.sendFile('index', {root: __dirname});
})


//post
app.post('/productos' , (req, res)=>{
    const {name, price, thumbnail} = req.body;
    const productos = new Productos()
    const newID = productos.getProductos().length + 1;
    const producto = {
        id: newID,
        name,
        price,
        thumbnail,
        quantity: 1,
        time: Date.now(),
        desc: "Producto agregado al carrito"
    }
    productos.saveProductos(producto)
    res.redirect('/productos');
})


// producto/id


app.get('/productos/:id', (req, res)=>{
    try{
        const {id} = req.params;
        const productos = new Productos()
        const producto = productos.getProductos().find(i => i.id == id)
        res.status(200).json({
            name: producto.name,
            price: producto.price,
            thumbnail: producto.thumbnail,
            id: producto.id,
            quantity: producto.quantity,
            time: new Date(producto.time).toLocaleString(),
            desc: producto.desc
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})
//put
app.put('/productos/:id', (req, res)=>{
    try{
        const {id} = req.params;
        const {name, price, thumbnail} = req.body;
        const productos = new Productos()
        const producto = productos.getProductos().find(i => i.id == id)
        producto.name = name;
        producto.price = price;
        producto.thumbnail = thumbnail;
        res.status(200).json({
            name: producto.name,
            price: producto.price,
            thumbnail: producto.thumbnail,
            id: producto.id,
            quantity: producto.quantity,
            time: new Date(producto.time).toLocaleString(),
            desc: producto.desc
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})




// delete

app.delete('/productos/:id', (req, res)=>{
    try{
        const {id} = req.params;
        const productos = new Productos()
        const producto = productos.getProductos().find(i => i.id == id)
        productos.deleteProductos(id)
        res.status(200).json({
            producto
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})

//CART

//get
app.get('/cart/productos', (_req, res)=>{
    const productos = new Cart()
    res.status(200).json({
        productos: productos.getCart()
    })
}
)

//post
app.post('/cart/productos' , (req, res)=>{
    const {name, price, thumbnail} = req.body;
    const productos = new Cart()
    const newID = productos.getCart().length + 1;
    const producto = {
        id: newID,
        name,
        price,
        thumbnail,
        quantity: 1,
        time: Date.now(),
        desc: "Producto agregado al carrito"
    }
    productos.saveCart(producto)
    res.status(200).json({
        producto
    })
})

//delete 
app.delete('/cart', (_req, res)=>{
    const productos = new Cart()
    productos.deleteCart()
    res.status(200).json({
        productos: productos.getCart()
    })
})


app.delete('/cart/productos/:id', (req, res)=>{
    try{
        const {id} = req.params;
        const productos = new Cart()
        const producto = productos.getCart().find(i => i.id == id)
        productos.deleteCart(id)
        res.status(200).json({
            producto
        })
    }catch(err){
        res.status(404).json({
            error: err
        })
    }
})






//chat


const PORT = process.env.PORT || 3000

http.listen(PORT, () => console.info(`Server up and running on port ${PORT}`));

io.on('connection', (socket) => {
    console.info('Nuevo cliente conectado')
    socket.emit('UPDATE_DATA', messages);
    socket.on('NEW_MESSAGE_TO_SERVER', data => {
        messages.push(data)
        console.info(messages)
        io.sockets.emit('NEW_MESSAGE_FROM_SERVER', data);
    })
})