let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// 声明一个数据集 对象
let userSchema = new Schema({
    msgid: {
        type: String,
        unique: true
    },
    nonce: {
        type: String
    },
    msg: String,

});
// 将数据模型暴露出去
module.exports = mongoose.model('users', userSchema);