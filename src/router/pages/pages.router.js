const authMiddlewares = require('../../middlewares/auth.middleware');

const router = require('express').Router();

router.get("/singIn", (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/home')
    }
    res.render("singIn");
})

router.get("/singUp", (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/home')
    }
    res.render("singUp");
})


router.get('/error', (_req, res) => {
    res.render('error')
})


router.get('/home', authMiddlewares, (_req, res) => {
    res.render('home')
})

module.exports = router;