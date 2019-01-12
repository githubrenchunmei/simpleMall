require('babel-register');
const app = require('./config/express');
const config = require('./config/config');
const mongoose = require('./config/mongoose');

mongoose.connect();

app.listen(config.PORT, () => {
    console.log(`serve started on port ${config.PORT}`)
});