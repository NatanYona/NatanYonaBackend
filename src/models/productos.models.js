import mongoose from "mongoose";


const productosSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    quantity: {type: Number, required: true},
    desc:  {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
});

export default mongoose.model("productos", productosSchema);