const express = require('express');

const Router = express.Router();

Router.get('/:name', (req, res, next) => {
    res.send(`hello ${req.params.name}`);
});

module.exports = Router;