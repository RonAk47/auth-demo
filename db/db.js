const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
            console.warn('Invalid/Missing Mongo URI');
            process.exit(1);
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Server has connect MongoDB: ${conn.connection.name}`);
    } catch (err) {
        console.error('Error while connecting mongodb', err);
        process.exit(1);
    }
};

module.exports = connectDB;
