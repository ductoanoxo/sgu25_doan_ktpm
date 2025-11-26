/**
 * Fix users with null permissions - Gán Customer permission cho users không có quyền
 */

const mongoose = require('mongoose');
const User = require('./Models/user');
const Permission = require('./Models/permission');

const USER = 'toantra349';
const PASS = encodeURIComponent('toantoan123');
const DB = 'mydb';
const HOST = 'ktpm.dwb8wtz.mongodb.net';
const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority`;

async function fixNullPermissions() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Find Customer permission
        const customerPerm = await Permission.findOne({ isCustomer: true });
        if (!customerPerm) {
            console.log('❌ Customer permission not found!');
            process.exit(1);
        }
        console.log('📋 Customer Permission ID:', customerPerm._id.toString());

        // Find all users with null permission
        const nullUsers = await User.find({ 
            $or: [
                { id_permission: null },
                { id_permission: { $exists: false } }
            ]
        });
        
        console.log(`\n📊 Found ${nullUsers.length} users with null/missing permission\n`);

        if (nullUsers.length === 0) {
            console.log('✅ No users to update!');
            process.exit(0);
        }

        // Ask for confirmation
        console.log('⚠️  This will update all these users to have "Customer" permission');
        console.log('Users to update:');
        nullUsers.slice(0, 5).forEach(u => {
            console.log(`  - ${u.fullname || u.username} (${u.email})`);
        });
        if (nullUsers.length > 5) {
            console.log(`  ... and ${nullUsers.length - 5} more`);
        }

        // Update all users
        console.log('\n🔧 Updating users...');
        const result = await User.updateMany(
            { 
                $or: [
                    { id_permission: null },
                    { id_permission: { $exists: false } }
                ]
            },
            { 
                $set: { id_permission: customerPerm._id }
            }
        );

        console.log(`\n✅ Updated ${result.modifiedCount} users successfully!`);
        
        // Verify
        const remainingNull = await User.countDocuments({ 
            $or: [
                { id_permission: null },
                { id_permission: { $exists: false } }
            ]
        });
        console.log(`📊 Remaining users with null permission: ${remainingNull}`);

        const totalCustomers = await User.countDocuments({ id_permission: customerPerm._id });
        console.log(`📊 Total customers now: ${totalCustomers}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

fixNullPermissions();
