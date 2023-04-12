const getMongoConfig = () => {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
}

const getStorageConfig = () => {
    const Mongo_URI = process.env.Mongo_URI || 'mongodb://localhost:27017/';
    return {
        mongoURl: Mongo_URI,
        ttl: 3600,
        mongoOptions: getMongoConfig(),
    }
}

module.exports = {
    getStorageConfig,
    getMongoConfig
}