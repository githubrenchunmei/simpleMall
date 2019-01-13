const UserModel = require('../models/user.model');
const {
    responseClient,
    md5,
    MD5_SUFFIXSTR
    } = require('../util/util');
const jwt = require('jsonwebtoken');

exports.Register = (req, res, next) => {
    try {
        //获取参数
        let { userName, passWord, type = false} = req.body;
        //条件判断
        if (!userName) {
            responseClient(res, 202, '用户名不能为空');
            next();
        } else if (!passWord) {
            responseClient(res, 203, '密码不能为空');
            next();
        } else {
            //查询数据库中是否包含当前用户
            UserModel.findOne({userName: userName}).then((data) => {
                if (data) {
                    responseClient(res, 202, '用户名已经存在');
                    next();
                } else {
                    //定义新用户
                    let user = new UserModel({
                        userName: userName,
                        passWord: md5(passWord + MD5_SUFFIXSTR),
                        type: type,
                        description: '',
                        order: ''
                    });
                    user.save().then(() => {
                        UserModel.findOne({userName: userName}).then((data) => {
                            responseClient(res, 201, '注册成功', data);
                            next();
                        });
                    });
                }
            });
        }
    } catch (err) {
        responseClient(res, 202, '注册失败，请重新注册');
        next();
    }
};
exports.Login = (req, res, next) => {
    try {
        //获取参数
        let { userName, passWord} = req.body;
        //查询用户名和密码是否正确
        UserModel.findOne({
            userName: userName,
            passWord: md5(passWord + MD5_SUFFIXSTR)
        }).then((data) => {
            if (data) {
                //登录成功
                //生成token
                const token = jwt.sign({
                    name: data.userName,
                    passWord: data.passWord,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, 'simplemall');
                responseClient(res, 200, '登录成功', {token: token});
                next();
            } else {
                //登录失败
                responseClient(res, 201, '用户名或密码错误，请重新登录');
                // next();
            }
        });
    } catch (err) {
        responseClient(res, 201, '服务器内部错误');
        next();
    }
};
exports.Logout = (req, res, next) => {
    try {
        req.session.userName = null;
        responseClient(res, 200, '退出登录成功', null);
        next();
    } catch (err) {
        responseClient(res, 201, '退出登录失败', err);
        next();
    }
};