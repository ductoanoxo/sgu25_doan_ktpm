var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id_category: {
        type: String,
        ref: 'Category'
    },
    name_product: String,
    price_product: String,
    image: {
        type: String,
        required: [true, 'Hình ảnh sản phẩm là bắt buộc']
    },
    describe: String,
    gender: String,
    number: {
        type: Number,
        default: 0,
        min: [0, 'Số lượng không thể âm']
    }
});

var Products = mongoose.model('Products', schema, 'product');

module.exports = Products;