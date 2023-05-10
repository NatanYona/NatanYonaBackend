const express = require('express');
const router = express.Router();
const UserConstructor = require('../services/user.services.js');





//endpoints

router.get('/health', (_req, res) => {
    res.json({
        status: 'UP',
        envierment: process.env.NODE_ENV ,
        PORT: process.env.PORT
    });
}
);

router.post('/singIn', (req, res) => {
    const User = new UserConstructor();
    const newUser = {
        username: req.body.username,
        password: req.body.password,
    }
    User.saveUser(newUser);
    res.json(newUser);
    res.cookie('user', newUser.username, { maxAge: 900000, httpOnly: true });
}
);

router.post('/singUp', (req, res) => {
    const User = new UserConstructor();
    const loginUser = {
        username: req.body.username,
        password: req.body.password,
    }
    const verifyUser = User.verifyUser(loginUser);
    if(verifyUser === true){
        res.json({message: 'User verified'});
    }else{
        res.json({message: 'User not verified'});
    }
}
);





module.exports = router;