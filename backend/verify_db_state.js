const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Form = require('./models/Form');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const verifyCount = async () => {
    try {
        console.log('Attempting to check MongoDB document count...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connected to Database:', mongoose.connection.db.databaseName);

        const count = await Form.countDocuments();
        console.log(`📊 TOTAL APPLICATIONS IN DATABASE: ${count}`);

        const last = await Form.findOne().sort({ submittedAt: -1 });
        if (last) {
            console.log('🆕 Latest Submission:');
            console.log(`   Name: ${last.fullName}`);
            console.log(`   Email: ${last.email}`);
            console.log(`   Time: ${last.submittedAt}`);
        } else {
            console.log('📭 The collection is currently empty.');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error checking database:', err.message);
        process.exit(1);
    }
};

verifyCount();
