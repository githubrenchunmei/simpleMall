// 公用方法

module.exports = {
    responseClient: function responseClient(res, code = 202, message = '服务端异常', data = {}) {
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        return res.json(responseData);
    }
};