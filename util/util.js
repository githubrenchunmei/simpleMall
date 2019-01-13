// 公用方法
const crypto = require('crypto');
const config = require('../config/config');

module.exports = {
    //向客户端返回信息
    responseClient: function responseClient(res, code = 202, message = '服务端异常', data = {}) {
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        return res.json(responseData);
    },
    //md5
    md5: (pwd) => {
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex');
    },
    MD5_SUFFIXSTR: config.MD5_SUFFIXSTR
};