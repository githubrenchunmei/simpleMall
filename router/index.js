const express = require('express');
const userController = require('../controller/user.controller');
const {responseClient} = require('../util/util');

const Router = express.Router();

Router.post('/login', userController.Login);

//拦截器
Router.all('*', (req, res, next) => {
    // token验证
    console.log('拦截器');
    if (req.query.token) {
        console.log('has token');
    } else {
        responseClient(res, 101, '登录超时，请重新登录', null)
        next();
    }
});
module.exports = Router;