let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// 声明一个数据集 对象
let viewsSchema = new Schema({
    id: {
        type: Number,
        default: 1
    },

    views: {
        type: Number,
        default: 0
    }


});
// 将数据模型暴露出去
module.exports = mongoose.model('views', viewsSchema);