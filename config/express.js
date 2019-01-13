const express = require('express');
const router = require('../router/index.js');
const bodyParser = require('body-parser');
var session = require('express-session');

const app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'express_cookie',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000 * 60
        }
}));
app.use('/api', router);

module.exports = app;