const mongoose = require('mongoose');
const {getMongoConfig } = require("../../services/session.services");

const MONGO_URI = 'mongodb://localhost:27017';

const mongooseConect = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(MONGO_URI, getMongoConfig());
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongooseConect;