const express = require('express')
const productRouter = require('./productos/productos.routes')

const router = express.Router();


router.get('/health',(_req, res)=>{
    res.status(200).json({
        success: "true",
        health:  "Up",
        enviroment: process.env.ENVIRONMENT || "not found"
    })
})
router.use('/productos' , productRouter)

module.exports = router;