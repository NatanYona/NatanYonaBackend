/* connect with db */
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();



const uri = process.env.MONGO_URI;


const client = new MongoClient(uri, {
    serverAPI: {
        version: '1',
        strict: true,
        deprecated: true
    }
})

async function updateDataBase() {
    try {
        await client.connect();
        mongoose.set('strictQuery', false);
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
       console.log('Connected to DataBase');
       return client;
    } catch (error) {
        console.log(error);
    }
}






module.exports = updateDataBase;