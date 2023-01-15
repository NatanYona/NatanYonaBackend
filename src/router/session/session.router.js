const router = require('express').Router();
const UserModel = require('../../services/Mongo/models/user.model');
const md5 = require('md5');
const authMiddle = require('../../middlewares/auth.middleware');
const passport = require('passport');



router.get('/health', (_req, res) => {
    res.status(200).json({
        message: "Server is up and running",
        health: "OK",
    });
})

router.post('/singUp', passport.authenticate('singUp', {failureRedirect: "/error"}), async (req, res) => {
    console.log(req.body)
    res.redirect('/home')
})

router.post('/singIn', passport.authenticate('login', {failureRedirect: "/error"}), async (req, res) => {
    console.log(req.body)
    res.redirect('/home')
})


router.get('singOut', (req, res) => {
    req.logout(()=>{
        res.redirect('/singIn')
    })
})

router.get('/datos', authMiddle , (req, res) => {
    res.status(200).json({
        data: req.session
    })
})


module.exports = router;