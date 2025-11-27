require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./Models/order');
const Users = require('./Models/user');

const USER = 'toantra349';
const PASS = encodeURIComponent('toantoan123');
const DB = 'mydb';
const HOST = 'ktpm.dwb8wtz.mongodb.net';

const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

console.log('🔌 Connecting to MongoDB Atlas...');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    
    try {
        // Find all orders
        const orders = await Order.find();
        console.log(`📦 Found ${orders.length} orders`);
        
        // Find a default customer user to use as replacement
        const defaultCustomer = await Users.findOne().sort({ _id: 1 });
        if (!defaultCustomer) {
            console.log('❌ No users found to use as default');
            process.exit(1);
        }
        console.log(`👤 Using default user: ${defaultCustomer.username} (${defaultCustomer._id})`);
        
        let fixedCount = 0;
        let deletedCount = 0;
        
        for (const order of orders) {
            let needsUpdate = false;
            const updates = {};
            
            // Check id_user
            if (order.id_user && !String(order.id_user).match(/^[0-9a-fA-F]{24}$/)) {
                console.log(`⚠️  Invalid id_user "${order.id_user}" in order ${order._id}`);
                updates.id_user = defaultCustomer._id;
                needsUpdate = true;
            }
            
            // Check id_payment
            if (order.id_payment && !String(order.id_payment).match(/^[0-9a-fA-F]{24}$/)) {
                console.log(`⚠️  Invalid id_payment "${order.id_payment}" in order ${order._id}`);
                // Set to null, let it be handled later
                updates.id_payment = null;
                needsUpdate = true;
            }
            
            // Check id_note
            if (order.id_note && !String(order.id_note).match(/^[0-9a-fA-F]{24}$/)) {
                console.log(`⚠️  Invalid id_note "${order.id_note}" in order ${order._id}`);
                updates.id_note = null;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await Order.updateOne({ _id: order._id }, updates);
                fixedCount++;
                console.log(`✅ Fixed order ${order._id}`);
            }
        }
        
        console.log(`\n✅ Done! Fixed ${fixedCount} orders`);
        if (deletedCount > 0) {
            console.log(`🗑️  Deleted ${deletedCount} orders`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
    
    mongoose.connection.close();
    process.exit(0);
})
.catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
});
