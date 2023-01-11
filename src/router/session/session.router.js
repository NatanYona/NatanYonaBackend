const express = require('express');
const statusCode = require('http-status');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/health', (_req, res) => {
    res.status(statusCode.OK).json({
        success: true,
        enviroment: process.env.ENVIRONMENT || 'not found',
        health: 'up',
    });
});


router.get('/', (req, res) => {
    if(!req.session.username) {
        res.render('login');
    } else {
        res.render('index', { username: req.session.username });
    }
});


router.get('/contador' , authMiddleware , (req, res) => {
    if (!req.session.contador) {
        req.session.contador = 0;
    }
    req.session.contador++;
    res.status(statusCode.OK).json(req.session.contador);
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            res.status(500).send('Error al cerrar sesion');
        }
    });
    res.status(200).redirect('/productos');
});

router.post('/login', (req, res) => {
    const userTest = 'test'
    const passTest = 'test'
    const { username, password } = req.body;
    if(!username || !password){
        res.status(400).send('Faltan datos'); 
    }
    if(username != userTest || password != passTest){
        res.status(403).send(`${statusCode[403]}, Usuario o contraseña incorrectos`);
    }
    req.session.username = username;
    res.redirect('/productos');
});




module.exports = router;