const router = require('express').Router();



router.get('/health', (_req, res) => {
    res.status(200).json({
        message: "Server is up and running",
        health: "OK",
    });
})

router.get('/login', (req, res) => {
    res.render('./pages/login')
})

router.get('/singUp', (req,res) => {
    res.render('./pages/singUp')
})

router.get('/verify', (req, res) => {
    if (req.cookies.user) {
        res.status(200).json({
            message: "User is logged in",
            username: req.cookies.user,
        });
    } else {
        res.status(401).json({
            message: "User is not logged in",
        });
    }
})

router.get('/welcome', (req, res) => {
    if (req.cookies.user) {
        res.render('./pages/welcome', { user: req.cookies.user })
    } else {
        res.redirect('/session/login')
    }
})

module.exports = router;