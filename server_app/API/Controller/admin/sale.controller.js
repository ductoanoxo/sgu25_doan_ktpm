const Sale = require('../../../Models/sale')


module.exports.index = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const keyWordSearch = req.query.search;

    const perPage = parseInt(req.query.limit) || 8;
    const totalPage = Math.ceil(await Sale.countDocuments() / perPage);

    let start = (page - 1) * perPage;
    let end = page * perPage;

    const sale = await Sale.find().populate('id_product');

    if (!keyWordSearch) {
        res.json({
            sale: sale.slice(start, end),
            totalPage: totalPage
        })

    } else {
        var newData = sale.filter(value => {
            return value.id.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        })

        res.json({
            sale: newData.slice(start, end),
            totalPage: totalPage
        })
    }
}

module.exports.create = async (req, res) => {

    const check = await Sale.find({ id_product: req.body.id_product })

    let flag = false

    check.forEach(value => {
        if (value.status === true){
            flag = true
        } 
    })

    if (flag){
        res.send("Sản phẩm này đã có khuyến mãi")
    }else{
        // Xử lý promotion: loại bỏ ký tự % và chuyển thành số
        let promotionValue = req.body.promotion;
        if (typeof promotionValue === 'string') {
            promotionValue = promotionValue.replace('%', '');
            promotionValue = parseFloat(promotionValue);
        }

        // Kiểm tra promotion value hợp lệ
        if (isNaN(promotionValue) || promotionValue < 0 || promotionValue > 100) {
            return res.send("Giá trị khuyến mãi không hợp lệ (0-100)")
        }

        // Tạo object data với promotion đã được xử lý
        const saleData = {
            ...req.body,
            promotion: promotionValue
        };

        await Sale.create(saleData)

        res.send("Bạn đã thêm thành công")
    }

}

module.exports.detail = async (req, res) => {

    const id = req.params.id

    const sale = await Sale.findOne({ _id: id })

    res.json(sale)

}

module.exports.update = async (req, res) => {

    const id = req.params.id

    const sale = await Sale.findOne({ _id: id })

    // Xử lý promotion: loại bỏ ký tự % và chuyển thành số
    let promotionValue = req.body.promotion;
    if (typeof promotionValue === 'string') {
        promotionValue = promotionValue.replace('%', '');
        promotionValue = parseFloat(promotionValue);
    }

    // Kiểm tra promotion value hợp lệ
    if (isNaN(promotionValue) || promotionValue < 0 || promotionValue > 100) {
        return res.json("Giá trị khuyến mãi không hợp lệ (0-100)")
    }

    sale.promotion = promotionValue
    sale.describe = req.body.describe
    sale.status = req.body.status
    sale.id_product = req.body.id_product

    sale.save()

    res.json("Bạn đã cập nhật thành công")

}

module.exports.list = async (req, res) => {

    const sale = await Sale.find({ status: true }).populate('id_product')

    res.json(sale)

}

module.exports.detailList = async (req, res) => {

    const id = req.params.id

    const sale = await (await Sale.findOne({ id_product: id, status: true }).populate('id_product'));

    if (sale){
        res.json({
            msg: "Thanh Cong",
            sale: sale
        })
    }else{
        res.json({
            msg: "That Bai"
        })
    }
}