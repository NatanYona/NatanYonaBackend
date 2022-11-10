const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IoServer} = require('socket.io');
const Productos = require('./src/services/productos.services');
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

app.get('/productos', (_req, res) => {
    res.sendFile('index', {root: __dirname});
})

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