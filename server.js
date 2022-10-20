const express = require('express')
const fs = require('fs')

require('dotenv').config()

const app = express()

app.get('/',(_req, res)=>{
    res.status(202).send('<h1>Hola</h1>')
})
app.get('/ping',(_req, res)=>{
    res.status(202).send('<h1>pong</h1>')
})

app.get('/productos',(_req, res)=>{
        const data = fs.readFileSync("./productos.txt" , 'utf-8')
        let productos = data
    res.status(202).json(productos)
})

app.get('/productoRandom',(_req, res)=>{
    const data = fs.readFileSync("./productos.txt" , 'utf-8')
    const jsonData = JSON.parse(data)
    const random = Math.floor(Math.random()* jsonData.length)
    const object = jsonData.find(obj => obj.id === random);
    res.status(202).json(object)
})



const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log(`server up on ${PORT}`)
})