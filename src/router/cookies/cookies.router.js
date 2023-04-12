const express = require('express');

const router = express.Router();

router.get('/getAll', (req, res) => {
    res.status(200).json(req.signedCookies);
});


//falta un autentificador si esta cookie existe

router.delete('/delete/:cookie', (req, res) => {
    const { cookie } = req.params;
    res.clearCookie(cookie).send(`${cookie} has been deleted`);
});

router.post('/set/:cookie', (req, res) => {
    const { cookie } = req.params;
    const { value } = req.body;
    const config = { maxAge: 600000, signed: true };
    if (!value) return res.status(400).json({ message: 'value is required' }
    );
    res.cookie(cookie, value).send('cookie set');
});


module.exports = router;