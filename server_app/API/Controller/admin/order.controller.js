const Order = require('../../../Models/order');
const Detail_History = require('../../../Models/detail_order');
const mongoose = require('mongoose');



module.exports.index = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let money = 0;

        const status = req.query.status;
        const keyWordSearch = req.query.search;

        const perPage = parseInt(req.query.limit) || 8;

        let start = (page - 1) * perPage;
        let end = page * perPage;

        console.log('📦 Fetching orders...');
        let orders;
        if (status) {
            orders = await Order.find({ status: status });
            console.log(`Found ${orders.length} orders with status: ${status}`);
        } else {
            orders = await Order.find();
            console.log(`Found ${orders.length} total orders`);
        }

        // Check for invalid references before populating
        const invalidOrders = orders.filter(o => {
            const isInvalidUser = o.id_user && !String(o.id_user).match(/^[0-9a-fA-F]{24}$/);
            const isInvalidPayment = o.id_payment && !String(o.id_payment).match(/^[0-9a-fA-F]{24}$/);
            const isInvalidNote = o.id_note && !String(o.id_note).match(/^[0-9a-fA-F]{24}$/);
            if (isInvalidUser) console.log(`⚠️  Invalid id_user: ${o.id_user} in order ${o._id}`);
            if (isInvalidPayment) console.log(`⚠️  Invalid id_payment: ${o.id_payment} in order ${o._id}`);
            if (isInvalidNote) console.log(`⚠️  Invalid id_note: ${o.id_note} in order ${o._id}`);
            return isInvalidUser || isInvalidPayment || isInvalidNote;
        });

        if (invalidOrders.length > 0) {
            console.log(`❌ Found ${invalidOrders.length} orders with invalid references`);
            return res.status(500).json({ 
                msg: 'Có dữ liệu không hợp lệ trong database',
                invalidCount: invalidOrders.length
            });
        }

        // Now safe to populate
        console.log('🔗 Populating relations...');
        orders = await Order.find(status ? { status } : {})
            .populate('id_user')
            .populate('id_payment')
            .populate('id_note');
        console.log('✅ Population complete');

        // In-memory search
        if (keyWordSearch) {
            orders = orders.filter(value => {
                const fullname = value.id_note ? value.id_note.fullname.toUpperCase() : '';
                const email = value.id_user ? value.id_user.email.toUpperCase() : '';
                const address = value.address ? value.address.toUpperCase() : '';
                const id = value._id.toString().toUpperCase();
                const search = keyWordSearch.toUpperCase();

                return fullname.indexOf(search) !== -1 ||
                       email.indexOf(search) !== -1 ||
                       address.indexOf(search) !== -1 ||
                       id.indexOf(search) !== -1;
            });
        }

        // Reverse after filtering
        orders.reverse();

        const totalPage = Math.ceil(orders.length / perPage);

        // Calculate money on the filtered (but not paginated) results
        orders.forEach((value) => {
            money += Number(value.total);
        });

        res.json({
            orders: orders.slice(start, end),
            totalPage: totalPage,
            totalMoney: money
        });
    } catch (error) {
        console.log('❌ Error in order.index:', error.message);
        next(error); // Pass to global error handler
    }
};

module.exports.detailOrder = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const keyWordSearch = req.query.search;

    const perPage = parseInt(req.query.limit) || 8;

    let start = (page - 1) * perPage;
    let end = page * perPage;

    const details = await Detail_History.find({ id_order: req.params.id }).populate('id_order').populate('id_product');

    const totalPage = Math.ceil(details.length / perPage);

    if (!keyWordSearch) {
        res.json({
            details: details.slice(start, end),
            totalPage: totalPage
        });
    } else {
        var newData = details.filter(value => {
            return value.name_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.price_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.count.toString().toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.size.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1;
        });

        res.json({
            details: newData.slice(start, end),
            totalPage: totalPage
        });
    }
};

module.exports.details = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id }).populate('id_user').populate('id_payment').populate('id_note');

    res.json(order);

};

module.exports.confirmOrder = async (req, res) => {
    await Order.updateOne({ _id: req.query.id }, { status: '2' }, function (err, res) {
        if (err) return res.json({ msg: err });
    });
    res.json({ msg: 'Thanh Cong' });
};

module.exports.delivery = async (req, res) => {
    await Order.updateOne({ _id: req.query.id }, { status: '3' }, function (err, res) {
        if (err) return res.json({ msg: err });
    });
    res.json({ msg: 'Thanh Cong' });
};

module.exports.confirmDelivery = async (req, res) => {
    await Order.updateOne({ _id: req.query.id }, { status: '4', pay: true }, function (err, res) {
        if (err) return res.json({ msg: err });
    });
    res.json({ msg: 'Thanh Cong' });
};

module.exports.cancelOrder = async (req, res) => {
    await Order.updateOne({ _id: req.query.id }, { status: '5' }, function (err, res) {
        if (err) return res.json({ msg: err });
    });
    res.json({ msg: 'Thanh Cong' });
};


module.exports.completeOrder = async (req, res) => {

    let page = parseInt(req.query.page) || 1;
    let money = 0;

    const getDate = req.query.getDate;

    const perPage = parseInt(req.query.limit) || 8;

    let start = (page - 1) * perPage;
    let end = page * perPage;

    const orders = await (await Order.find({ status: '4' }).populate('id_user').populate('id_payment').populate('id_note')).reverse();

    if(!getDate){

        const totalPage = Math.ceil(orders.length / perPage);

        orders.map((value) => {
            money += Number(value.total);
        });

        res.json({
            orders: orders.slice(start, end),
            totalPage: totalPage,
            totalMoney: money
        });

    }else{

        const newOrder = orders.filter(value => {
            return value.create_time.toString().indexOf(getDate.toString()) !== -1;
        });

        const totalPage = Math.ceil(newOrder.length / perPage);

        newOrder.map((value) => {
            money += Number(value.total);
        });

        res.json({
            orders: newOrder.slice(start, end),
            totalPage: totalPage,
            totalMoney: money
        });

    }

};