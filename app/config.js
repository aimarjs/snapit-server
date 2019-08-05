module.exports = {
    name: 'snapit-server',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    base_url: process.env.DATABASE_URL || 'http://0.0.0.0:8080',
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snapit',
    },
};
