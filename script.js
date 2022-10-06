class User {
    constructor(nombre,apellido,libros = "ninguno" ,mascotas = "ninguna"){
        this.nombre = nombre
        this.apellido = apellido
        this.libros = [libros]
        this.mascotas = [mascotas]
    }

    getFullName(){
        return 'El nombre Completo es: ' + this.nombre + ' ' + this.apellido
    }

    addMascota(NombreMascota){
        return this.mascotas.push(NombreMascota)
    }

    countMascotas(){
        return this.mascotas.length
    }

    addBook(Nombre, Autor){
        return this.libros.push({ Nombre,Autor})
    }

    GetBookNames(){
        return this.libros.map(book => {
            return book.nombre
        })
    }

}

const usuario = new User("Martin", "martinez","martin fierro2","pez")
const usuarioFullName = usuario.getFullName()
const agregarMascota = usuario.addMascota("gato")
const contarMascotas = usuario.countMascotas()
const agregarLibro = usuario.addBook("martin fierro", "Jose Hernadez")
const listaDeLibros = usuario.GetBookNames()

console.log(usuario)
console.log(usuarioFullName)