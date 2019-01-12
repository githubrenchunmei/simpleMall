const express = require('express');
const router = require('../router/index.js');
const bodyParser = require('body-parser');

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/api', router);


module.exports = app;