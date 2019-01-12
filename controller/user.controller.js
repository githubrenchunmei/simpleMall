const UserModel = require('../models/user.model');
const {responseClient} = require('../util/util');

exports.Login = (req, res, next) => {
    try {
        //获取参数
        let { userName, passWord} = req.body;
        res.send(`${userName}:${passWord}`);
    } catch (err) {
        responseClient(res, 201, '获取登录信息时发生服务器内部错误')
    }
};