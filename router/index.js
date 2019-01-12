const express = require('express');

const Router = express.Router();

Router.get('/', (req, res, next) => {
    res.send('hello,this is index');
});

module.exports = Router;