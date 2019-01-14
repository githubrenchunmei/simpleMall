const mongooes = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const User = mongooes.Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
        max:18,
        min:3
    },
    passWord: {
        type: String,
        trim: true,
        required:true,
        max: 20,
        min: 6
    },
    type: {
        type: Boolean
    },
    description: {
        type: String
    },
    order: {
        type: String
    }
});
// 添加分页插件
User.plugin(mongoosePaginate);
const UserModel = mongooes.model('User', User);
module.exports = UserModel;