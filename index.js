const fs = require('fs')

function contenedor(file) {
    let array = []
    try {
        const data = fs.readFileSync(file, 'utf-8')
        if(data != ""){
            jsonData = JSON.parse(data)
            array = jsonData
        } else{
            console.log("vacio")
        }
    }
    catch(error){
        console.log(error)
    }

    function save(nombre, price, thubmnail) {
        try {
            let newid = array.length + 1
            array.push({ title: nombre, price: price, thumbnail: thubmnail, id : newid})
            data = JSON.stringify(array)
            fs.writeFileSync(file , data)
        }
        catch (error) {
            console.log(error)
        }

    }
    function getById(id){
        const object = array.find(obj => obj.id === id);
        console.log("Get By Id")
        console.log(object)
    }

    function getAll(){
        console.log("getAll")
        console.log(array)
    }

    function deleteById(id){
        const object = array.find(obj => obj.id === id);
        array.splice(object, 1)
        console.log("delete By Id")
        console.log(array)
        console.log(id)
    }

    function deleteAll(){
        fs.writeFileSync(file, "")
        console.log("Se borro la informacion del archivo")
    }

    /* save("jose",200,"google.com")
    getById(1) */
    getAll()
}

contenedor('productos.txt')