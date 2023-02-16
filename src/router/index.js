const express = require('express');
const router = express.Router();
const cookieRouter = require('./cookies/cookies.router');
const sessionRouter = require('./session/session.router');
const pagesRouter = require('./pages/pages.router');
const app = require('../../server');
const passport = require('passport');
const { config } = require('dotenv');





router.get("/health", (_req, res) => {
    res.status(200).json({
        message: "Server is up and running",
        health: "OK",
    });
})

router.get('/info', (_req, res) => {
    res.status(200).json({
        directory: process.cwd(),
        IDdelproceso: process.pid,
        nodeVersion: process.version,
        TitulodelProceso: process.title,
        plataforma: process.platform,
        MemoryUse: process.memoryUsage(),
        uptime: process.uptime(),
    })
})


router.use('/cookies', cookieRouter)

router.use('/session', sessionRouter)

router.use('/pages', pagesRouter)


router.get('auth/twitter', passport.authenticate('twitter'))

router.get('auth/twitter/callback', passport.authenticate('twitter',{failureRedirect: "/error", successRedirect: "/home"}))


module.exports = router; 