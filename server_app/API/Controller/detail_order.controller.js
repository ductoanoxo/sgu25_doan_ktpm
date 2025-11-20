const Detail_Order = require('../../Models/detail_order');
const Product = require('../../Models/product');

// Hiển thị chi tiết hóa đơn
// Phương thức GET
module.exports.detail = async(req, res) => {

    const id_order = req.params.id;

    const detail_order = await Detail_Order.find({ id_order: id_order }).populate('id_product');

    res.json(detail_order);

};

// Phuong Thuc Post - Tạo detail order và trừ tồn kho
module.exports.post_detail_order = async(req, res) => {

    try {
        const { id_product, count } = req.body;

        // ✅ Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(id_product);
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Sản phẩm không tồn tại'
            });
        }

        // ✅ Kiểm tra tồn kho
        if (product.number < count) {
            return res.status(400).json({
                success: false,
                msg: `Không đủ hàng! Chỉ còn ${product.number} sản phẩm`
            });
        }

        // ✅ Trừ tồn kho
        product.number -= count;
        await product.save();

        // ✅ Tạo detail order
        await Detail_Order.create(req.body);

        res.json({
            success: true,
            msg: 'Đặt hàng thành công',
            remaining: product.number
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            msg: 'Lỗi server'
        });
    }

};