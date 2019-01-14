/*
 *@Author: rcm
 *@Date: 2019-1-12 16:38:49
 *@Description: 用户控制器
 */
const UserModel = require('../models/user.model');
const {
    responseClient,
    md5,
    MD5_SUFFIXSTR
    } = require('../util/util');
const jwt = require('jsonwebtoken');

/** 
 * @msg: 用户注册接口
 * @param {req} Request 请求参数
 * @param {req} Response 相应参数
 * @param {next} 下一个中间件
 */
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
/** 
 * @msg: 用户登录接口
 * @param {req} Request 请求参数
 * @param {req} Response 相应参数
 * @param {next} 下一个中间件
 */
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
                next();
            }
        });
    } catch (err) {
        responseClient(res, 201, '服务器内部错误');
        next();
    }
};
/** 
 * @msg: 退出登录接口
 * @param {req} Request 请求参数
 * @param {req} Response 相应参数
 * @param {next} 下一个中间件
 */
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
/** 
 * @msg: 获取当前用户详细信息
 * @param {req} Request 请求参数
 * @param {req} Response 相应参数
 * @param {next} 下一个中间件
 */
exports.getUserInfo = async (req, res, next) => {
   if (req.session.userName) {
       let userInfo =await UserModel.find({userName: req.session.userName}, '_id userName type description order').catch(err => {
           responseClient(res, 201, '服务器内部问题', userInfo);
           next();
       });
       if (userInfo) {
           responseClient(res, 200, '获取用户资料', userInfo);
       } else {
           responseClient(res, 201, '当前查询用户不存在', userInfo);
       }
   }
};
/**
 * @msg: 更新用户信息
 * @param {req} Request 请求参数
 * @param {res} Response 相应参数
 * @param {next} 下一个中间件
 */
exports.update = async (req, res, next) => {
    try {
        let {userName, passWord, description} = req.body;
        if (req.session.userName) {
            let updataInfo = await UserModel.update({userName: req.session.userName},{
                userName,
                passWord: md5(passWord + MD5_SUFFIXSTR),
                description
            }).catch(err => {
                responseClient(res, 201, '服务器内部错误', err);
            });
            if (updataInfo) {
                responseClient(res, 200, '更新成功', updataInfo);
            } else {
                responseClient(res, 201, '更新失败');
            }
        }
    } catch (err) {
        responseClient(res, 201, '服务器内部错误', err);
    }
    
};
/**
 * @msg: 提升其他用户为管理员
 * @param {req} Request 请求参数
 * @param {res} Response 相应参数
 * @param {next} 下一个中间件
 */
exports.promoteAdmin = async (req, res, next) => {
    try{
        //判断当前用户是否有操作权限
        if (req.session.userName) {
            console.log(req.session.userName);
            let typeInfo =await UserModel.findOne({userName: req.session.userName}, 'type').catch(err => {
                responseClient(res, 201, '服务器内部错误');
            });
            if (typeInfo.type) {
                let {id} = req.body;
                let promoteInfo = await UserModel.update({_id: id}, {type: true}).catch(err => {
                    responseClient(res, 201, '服务器内部错误');
                });
                if (promoteInfo) {
                    responseClient(res, 200, '提升用户权限成功', promoteInfo);
                } else {
                    responseClient(res, 201, '提升用户权限失败');
                }
            } else {
                responseClient(res, 201, '您没有权限');
                next();
            }
        }
    } catch (err) {
        responseClient(res, 201, '服务器内部错误');
    }
};
/**
 * @msg: 获取用户列表
 * @param {req} Request 请求参数
 * @param {res} Response 相应参数
 * @param {next} 下一个中间件
 */
exports.userList = async (req, res, next) => {
    try {
        let { limitNum = 10, pageNum = 1} = req.query;
        let paginateInfo = await UserModel.paginate({},{
            select: '',
            page: pageNum,
            limit: parseInt(limitNum)
        }).catch(err => {
            responseClient(res, 201, '服务器内部错误', err);
        });
        if (paginateInfo) {
            responseClient(res, 200, '获取用户列表成功', paginateInfo);
        } else {
            responseClient(res, 201, '获取用户列表失败');
        }
    } catch (err) {
        responseClient(res, 201, '服务器内部错误');
    }
};