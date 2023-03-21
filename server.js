const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IoServer } = require('socket.io');
const Productos = require('./src/services/productos.services');
const Cart = require('./src/services/cart.services');
const coockieParser = require('cookie-parser');
const indexRouter = require('./src/router/index');
const logger = require('morgan');
const session = require('express-session');
const emailjs = require('@emailjs/browser');
const mongoose = require('mongoose');
require('dotenv').config();
const compression = require('compression');
const log4js = require('log4js');
const uuidv4 = require('uuid').v4;




const messages = [];
const app = express();
app.use(compression())
const http = new HttpServer(app);
const io = new IoServer(http);

log4js.configure({
    appenders: {
        file: { type: 'file', filename: 'server.log' },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        server: { appenders: ['file'], level: 'warn' }
    }
});





app.use(express.static(__dirname + '/public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))

app.set('views', "./views")
app.set('view engine', 'ejs')

const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(coockieParser(COOKIE_SECRET));

app.use(session({
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
    }
}));

app.use(indexRouter);



//////end points


app.get('/api/randoms', (req, res) => {
    //get random number between 0 and 10000 and send req.query times in an array
    const min = 0;
    const max = 10000;
    const randoms = [];
    const cant = req.query.cant || 1;
    for (let i = 0; i < cant; i++) {
        randoms.push(Math.floor(Math.random() * (max - min) + min))
    }
    res.status(200).json({
        randoms
    })
})






app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        enviroment: process.env.ENVIRONMENT || "not found",
        health: "up",
    })
})

app.get('/ping', (_req, res) => {
    res.status(200).json({
        ping: "PONG"
    })
})

/// /Productos

//get
app.get('/productos', (req, res) => {
    const productos = new Productos()
    res.render('./pages/index', { productos: productos.getProductos(), user: req.session.username })
})

app.get('/productos', (_req, res) => {
    res.sendFile('index', { root: __dirname });
})



app.get('/api/productos-test', (_req, res) => {
    const productos = new Productos()
    res.status(200).json({
        productos: productos.generateProductos()
    })
})

//post
app.post('/productos', (req, res) => {
    const { name, price, thumbnail } = req.body;
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


app.get('/productos/:id', (req, res) => {
    try {
        const { id } = req.params;
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
    } catch (err) {
        res.status(404).json({
            error: err
        })
    }
})


//put
app.put('/productos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, thumbnail } = req.body;
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
    } catch (err) {
        res.status(404).json({
            error: err
        })
    }
})




// delete

app.delete('/productos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const productos = new Productos()
        const producto = productos.getProductos().find(i => i.id == id)
        productos.deleteProductos(id)
        res.status(200).json({
            producto
        })
    } catch (err) {
        res.status(404).json({
            error: err
        })
    }
})

//CART

//get
app.get('/cart/productos', (_req, res) => {
    const productos = new Cart()
    res.status(200).json({
        productos: productos.getCart()
    })
}
)

//post
app.post('/cart/productos', (req, res) => {
    const { name, price, thumbnail } = req.body;
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
app.delete('/cart', (_req, res) => {
    const productos = new Cart()
    productos.deleteCart()
    res.status(200).json({
        productos: productos.getCart()
    })
})


app.delete('/cart/productos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const productos = new Cart()
        const producto = productos.getCart().find(i => i.id == id)
        productos.deleteCart(id)
        res.status(200).json({
            producto
        })
    } catch (err) {
        res.status(404).json({
            error: err
        })
    }
})

const log = log4js.getLogger('server');

app.get('/data', (_req, res) => {
    log.info("server data port " + PORT + "process " + process.pid)
    res.send("server data port " + PORT + "process " + process.pid)
})


//chat


const PORT = parseInt(process.argv[2]) || 3000

http.listen(PORT, () => console.info(`Server up and running on port ${PORT} - process ${process.pid}`));

io.on('connection', (socket) => {
    console.info('Nuevo cliente conectado')
    socket.emit('UPDATE_DATA', messages);
    socket.on('NEW_MESSAGE_TO_SERVER', data => {
        messages.push(data)
        console.info(messages)
        io.sockets.emit('NEW_MESSAGE_FROM_SERVER', data);
    })
})




///connection to mongodb compass database
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${ err.message }`);
    });
//user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    id: String
}, { versionkey: false })
//user model
const Usuarios = mongoose.model('Usuarios', userSchema)
//user routes
app.get('/api/users', async (_req, res) => {
    const users = await Usuarios.find()
    res.status(200).json({
        users
    })
})
//sing up users
app.post('/api/singUp', async (req, res) => {
    const { username, password } = req.body;
    const user = new Usuarios({
        username: username,
        password: password,
        id: uuidv4()
    })
    await user.save()
    res.cookie('user', username, { maxAge: 900000, httpOnly: true });
    try{
        (function() {
            // https://dashboard.emailjs.com/admin/account
            emailjs.init('SHpbPqJmDSAFzgaXn');
        }.then(emailjs.send("service_gngm29l", "template_uhjd4wj",{
            from_name: username,
            to_name: "Admin",
            message: "El usuario " + username + " ha iniciado sesion, en la pagina. Hora: " + new Date().toLocaleString()
        })))}catch(error){
        console.log(error)
    }
    res.redirect('/session/welcome')
    })

//sing in users

app.post('/api/singIn', async (req, res) => {
    const { username, password } = req.body;
    //verify if user is in db, if exist give cookie to user
    Usuarios.find({ username: username, password: password }, function (err, docs) {
        if (docs.length) {
            res.cookie('user', username, { maxAge: 900000, httpOnly: true });
            res.redirect('/session/welcome')
        } else {
            res.status(404).json({
                error: "Usuario no encontrado"
            })
        }
    })
})



//logout

app.get('/api/logout', (_req, res) => {
    res.clearCookie('user')
    res.status(200).json({
        message: "Sesion cerrada"
})
})







module.exports = app