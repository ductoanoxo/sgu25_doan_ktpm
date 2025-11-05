const Coupon = require('../../../Models/coupon');
const Order = require('../../../Models/order');

module.exports.index = async (req, res) => {

    let page = parseInt(req.query.page) || 1;
    const keyWordSearch = req.query.search;

    const perPage = parseInt(req.query.limit) || 8;
    const totalPage = Math.ceil(await Coupon.countDocuments() / perPage);

    let start = (page - 1) * perPage;
    let end = page * perPage;

    const coupon = await Coupon.find();

    if (!keyWordSearch) {
        res.json({
            coupons: coupon.slice(start, end),
            totalPage: totalPage
        });

    } else {
        var newData = coupon.filter(value => {
            return value.code.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.promotion.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        });

        res.json({
            coupons: newData.slice(start, end),
            totalPage: totalPage
        });
    }

}

module.exports.create = async (req, res) => {

    await Coupon.create(req.body);

    res.json({ msg: 'Bạn đã thêm thành công'});

}

module.exports.update = async (req, res) => {

    const id = req.params.id;

    const coupon = await Coupon.findOne({ _id: id })

    coupon.code = req.body.code
    coupon.count = req.body.count
    coupon.promotion = req.body.promotion
    coupon.describe = req.body.describe

    coupon.save()

    res.json({ msg: 'Bạn đã cập nhật thành công'});

}

module.exports.delete = async (req, res) => {

    const id = req.params.id

    await Coupon.deleteOne({ _id: id })

    res.json("Thanh Cong")

}

module.exports.detail = async (req, res) => {

    const id = req.params.id

    const coupon = await Coupon.findOne({ _id: id })

    res.json(coupon)

}

module.exports.checking = async (req, res) => {

    const code = req.query.code
    const id_user = req.query.id_user
    const total_amount = req.query.total_amount // Thêm tham số tổng tiền

    console.log('=== COUPON DEBUG ===')
    console.log('Code nhận được:', code)
    console.log('User ID:', id_user)
    console.log('Total amount:', total_amount)

    const coupon = await Coupon.findOne({ code })

    console.log('Coupon tìm được:', coupon)

    if (!coupon){
        console.log('Không tìm thấy coupon')
        return res.json({ msg: "Không tìm thấy" })
    }

    const checkCoupon = await Order.findOne({ id_user: id_user, id_coupon: coupon._id })

    console.log('Check đã sử dụng:', checkCoupon)

    if (checkCoupon){
        console.log('Đã sử dụng coupon này rồi')
        return res.json({ msg: "Bạn đã sử dụng mã này rồi"})
    }

    // Kiểm tra điều kiện áp dụng coupon từ describe
    if (coupon.describe && total_amount) {
        const describe = coupon.describe.toLowerCase()
        const totalAmount = parseFloat(total_amount)
        
        console.log('Kiểm tra điều kiện từ describe:', describe)
        console.log('Tổng đơn hàng hiện tại:', totalAmount)
        
        // Helper function để chuyển đổi số từ string (hỗ trợ k, triệu, etc.)
        const parseAmount = (amountStr) => {
            const cleanStr = amountStr.replace(/[.,]/g, '')
            let amount = parseFloat(cleanStr)
            
            if (amountStr.includes('k') || amountStr.includes('K')) {
                amount = amount * 1000
            } else if (amountStr.includes('triệu') || amountStr.includes('tr')) {
                amount = amount * 1000000
            } else if (amount < 10000) {
                // Nếu số nhỏ hơn 10000 có thể là dạng viết tắt (500 = 500k)
                amount = amount * 1000
            }
            
            return amount
        }
        
        let isValid = true
        let errorMessage = ''
        
        // Case 1: Từ X đến Y (ví dụ: "từ 150k đến 300k")
        const rangeMatch = describe.match(/từ\s*(\d+(?:\.\d+)?)\s*k?\s*đến\s*(\d+(?:\.\d+)?)\s*k?/i)
        if (rangeMatch) {
            const minAmount = parseAmount(rangeMatch[1] + (describe.includes('k') ? 'k' : ''))
            const maxAmount = parseAmount(rangeMatch[2] + (describe.includes('k') ? 'k' : ''))
            
            console.log(`Điều kiện: từ ${minAmount} đến ${maxAmount}`)
            
            if (totalAmount < minAmount || totalAmount > maxAmount) {
                isValid = false
                errorMessage = `Đơn hàng phải từ ${new Intl.NumberFormat('vi-VN').format(minAmount)} VNĐ đến ${new Intl.NumberFormat('vi-VN').format(maxAmount)} VNĐ`
            }
        }
        // Case 2: Tối thiểu X (ví dụ: "tối thiểu 500k", "từ 500k")
        else {
            const minMatch = describe.match(/(?:từ|tối thiểu|trên|ít nhất)\s*(\d+(?:\.\d+)?)\s*k?/i)
            if (minMatch) {
                const minAmount = parseAmount(minMatch[1] + (describe.includes('k') ? 'k' : ''))
                
                console.log(`Điều kiện tối thiểu: ${minAmount}`)
                
                if (totalAmount < minAmount) {
                    isValid = false
                    errorMessage = `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(minAmount)} VNĐ`
                }
            }
            // Case 3: Tối đa X (ví dụ: "tối đa 1 triệu")
            else {
                const maxMatch = describe.match(/(?:tối đa|không quá|dưới)\s*(\d+(?:\.\d+)?)\s*(?:k|triệu|tr)?/i)
                if (maxMatch) {
                    const maxAmount = parseAmount(maxMatch[1] + (maxMatch[0].includes('k') ? 'k' : maxMatch[0].includes('triệu') || maxMatch[0].includes('tr') ? 'triệu' : ''))
                    
                    console.log(`Điều kiện tối đa: ${maxAmount}`)
                    
                    if (totalAmount > maxAmount) {
                        isValid = false
                        errorMessage = `Đơn hàng tối đa ${new Intl.NumberFormat('vi-VN').format(maxAmount)} VNĐ`
                    }
                }
            }
        }
        
        // Case 4: Các điều kiện đặc biệt khác có thể thêm vào đây
        // Ví dụ: kiểm tra ngày, sản phẩm cụ thể, v.v.
        
        if (!isValid) {
            console.log('Không đủ điều kiện áp dụng coupon:', errorMessage)
            return res.json({ 
                msg: "Không đủ điều kiện", 
                describe: coupon.describe,
                errorMessage: errorMessage
            })
        }
    }

    console.log('Coupon hợp lệ, trả về:', coupon)
    res.json({ msg: "Thành công", coupon: coupon })

}

module.exports.createCoupon = async (req, res) => {

    const id = req.params.id

    const coupon = await Coupon.findOne({ _id: id })

    coupon.count = parseInt(coupon.count) - 1

    coupon.save()

    res.json("Thanh Cong")

}