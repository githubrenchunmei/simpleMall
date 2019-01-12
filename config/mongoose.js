const mongoose = require('mongoose');
const config = require('./config');

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});
exports.connect = () => {
    console.log(`connecting to mongo @: ${config.DB_URL}`);
    mongoose.connect(config.DB_URL,{
        useNewUrlParser: true
    });
    return mongoose.connection;
};
exports.disconnect = () => {
    mongoose.disconnect(() => {
        console.log(`disconnecting to mongo @: ${config.DB_URL}`);
    });
};