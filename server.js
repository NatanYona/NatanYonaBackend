const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IoServer } = require('socket.io');
const Productos = require('./src/services/productos.services');
const Cart = require('./src/services/cart.services');
const ChatLog = require('./src/services/chatlog.services');
const { default: knex } = require('knex');
const coockieParser = require('cookie-parser');
const indexRouter = require('./src/router/index');
const logger = require('morgan');
const session = require('express-session');
const twitterStrategy = require('passport-twitter').Strategy;
const { getStorageConfig } = require('./src/services/session.services');
const MongoStore = require('connect-mongo');
const mongooseConect = require('./src/services/Mongo/connect');
const passport = require('passport');
const userModel = require('./src/services/Mongo//models/user.model');
const md5 = require('md5');
require('dotenv').config();


const localStategy = require('passport-local').Strategy;


const messages = [];
const app = express();

const http = new HttpServer(app);
const io = new IoServer(http);

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


passport.use(new twitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3005/auth/twitter/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    done(null, profile)
}
));




passport.use('login', new localStategy(async (username, password, done) => {
    const userData = await userModel.findOne({ username, password: md5(password) })
    if (!userData) {
        return done(null, false, { message: 'User not found' })
    }
    return done(null, userData)
}))


passport.use('singUp', new localStategy({ passReqToCallback: true }, async (req, username, password, done) => {
    const userData = await userModel.findOne({ username, password: md5(password) })
    if (userData) {
        return done(null, false, { message: 'User allready exist' })
    }
    const stageUser = new userModel({
        username,
        password,
        fullname: req.body.fullname
    })
    const newUser = await stageUser.save()
    return done(null, newUser)
}))

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    const userData = await userModel.findById(id)
    done(null, userData)
})

app.use(passport.initialize());
app.use(passport.session());



mongooseConect();

//////end points



app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        enviroment: process.env.ENVIRONMENT || "not found",
        health: "up"
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




///users db





module.exports = app
