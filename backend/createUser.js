const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createInitialUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Check if user already exists
        const userExists = await User.findOne({ email: 'hr404infotech@gmail.com' });

        if (userExists) {
            console.log('Default HR user already exists.');
            process.exit();
        }

        const user = await User.create({
            username: 'HR Admin',
            email: 'hr404infotech@gmail.com',
            password: 'HR404@password', // Default password
            role: 'admin'
        });

        console.log('Initial HR Admin user created successfully!');
        console.log('Email: hr404infotech@gmail.com');
        console.log('Password: HR404@password');
        process.exit();
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
};

createInitialUser();
