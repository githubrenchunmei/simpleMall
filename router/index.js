const express = require('express');
const userController = require('../controller/user.controller');
const {responseClient} = require('../util/util');
const multipart = require('connect-multiparty');
const jwt = require('jsonwebtoken');

const Router = express.Router();

var multipartMiddleware = multipart();

//拦截器
Router.all('*', (req, res, next) => {
    /**
     * token验证
     *  前端在退出登陆后应当删除缓存的token，保持前后端token的有效性
     */
    console.log('===================');
    if (req.query.token) {
        console.log('get token');
        try {
            const decodedToken = jwt.verify(req.query.token, 'simplemall');
            if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
                if (req.session.userName && req.session.userName === decodedToken.name) {
                    // token解码正确 时间未过期 并且session中包含userName
                    console.log('1');
                    next()
                  } else {
                    // token解码正确 时间未过期 但是session中不包含userName
                    req.session.userName = decodedToken.name
                    console.log('2');
                    next()
                    }
            } else {
                // token解码正确 但是时间过期
                console.log('3');
                responseClient(res, 101, '登陆超时，请重新登陆', null)
                next()
            }
        } catch (err) {
            console.log('4');
            responseClient(res, 102, 'token失效，请重新登录', null);
            next();
        }
    } else if (req.originalUrl.indexOf('login') > 0 || req.originalUrl.indexOf('register') > 0) {
        //过滤注册和登录接口
        console.log('5');
        next();
    } else {
        //未传递token
        console.log('6');
        responseClient(res, 101, '无token，请重新登录', null);
    }
});
//用户注册
Router.post('/register', multipartMiddleware, userController.Register);
//用户登录
Router.post('/login', multipartMiddleware, userController.Login);
//退出登录
Router.post('/logout', multipartMiddleware, userController.Logout);
//查询当前用户信息
Router.post('/getUserInfo', multipartMiddleware, userController.getUserInfo);
//更新当前用户信息
Router.post('/update', multipartMiddleware, userController.update);
//提升其他用户权限
Router.post('/promoteAdmin', multipartMiddleware, userController.promoteAdmin);
//获取用户列表
Router.post('/userList', multipartMiddleware, userController.userList);

module.exports = Router;