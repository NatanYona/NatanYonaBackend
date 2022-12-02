import mongoose from "mongoose";
import dotenv from "dotenv";
import productosSchema from "../CursoBackend/src/models/productos.models.js";

dotenv.config();


const CRUD = async () => {
    const MONGO_URL = process.env.MONGO_URL;
    const db_name = process.env.DB_NAME;
    const MONGO_CONNECT_STRING = `${MONGO_URL}/${db_name}`;

    const MONGOOSE_CONFIG = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    //connect to mongoDB
    await mongoose.connect(MONGO_CONNECT_STRING, MONGOOSE_CONFIG);
    console.info("Connected to MongoDB");


    //productos con precio menor a 1000
    const productos = await productosSchema.find({ price: { $lt: 1000 } });
    console.log(productos);

    //productos con precio entre 1000 y 3000
    const productos2 = await productosSchema.find({ price: { $gte: 1000, $lte: 3000 } });
    console.log(productos2);
    
    //productos con precio mayor a 3000
    const productos3 = await productosSchema.find({ price: { $gt: 3000 } });
    console.log(productos3);
    
    //add producto to colleciton
    const producto = new productosSchema({
        id: 969,
        name: "Producto 4",
        price: 4000,
        thumbnail: "google.com",
        quantity: 1,
        desc: "Agregado con mongoose",
        time: Date.now(),
    }
    );
    await producto.save();
    console.log(producto);
};
    //cambiar stock to 0 of all productos with price > 4000
    const productos4 = await productosSchema.updateMany({ price: { $gt: 4000 } }, { $set: { quantity: 0 } });
    console.log(productos4);

    //crear usuario pepe con contraseña asd456 que solo pueda leer db
    const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        password: { type: String, required: true },
    });
    const user = new userSchema({
        name: "pepe",
        password: "asd456",
    });
    await user.save();
    console.log(user); 

CRUD()
