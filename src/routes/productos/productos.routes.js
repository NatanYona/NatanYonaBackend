const express = require('express')
const fs = require('fs')
const router = express.Router()



let productos = []
    try{
        const data = fs.readFileSync('productos.txt', 'utf-8')
        if(data != ""){
            jsonData = JSON.parse(data)
            productos = jsonData
        }
    }
    catch(err){
        console.log(err)
    }

//devuelve todos los prodcutos
router.get('/', (_req, res) => {
    try {
        res.status(200).json(productos)
    }
    catch (err) {
        res.status(500).json(err)
    }
})


//te permite enviar productos
router.post('/', (req, res) => {
    try {
        const { body } = req
        let newID = productos.length + 1
        productos.push({title: body.name, price: body.precio, thumbnail: "google.com",  id: newID})
        data = JSON.stringify(productos)
        fs.writeFileSync('productos.txt', data)
        res.redirect('/index.html')
    }
    catch (err) {
        res.status(500).json(err)
    }
})



//te permite buscar por iD
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params
        if(id <= productos.length){
            const Selected = productos.filter(i => i.id == id)
            res.status(200).json({
            success: true,
            data: Selected
        })
        }else{
            res.json({error: "producto no encontrado"})
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/:id', (req, res)=>{
    try{
        const {id} = req.params
        let delSected = productos.filter(i => i.id == id)
        productos.splice(delSected, 1)
        data = JSON.stringify(productos)
        fs.writeFileSync('productos.txt', data)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.put('/:id',(req, res)=>{
    try{
        const {id} = req.params
        let putSelec = productos.filter(i => i.id == id)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;