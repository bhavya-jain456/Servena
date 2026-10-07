const mongoose = require('mongoose');
const { MONGODB } = require('../../config');

/**
 * Connect to MongoDB with retry logic.
 * ponytail: exponential backoff, 5 retries max. Enough for deploy restarts.
 */
const connectWithRetry = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(MONGODB.URL);
            // #3 Never log credentials — only host/port/name
            console.log('MongoDB connected at', `${MONGODB.HOST}:${MONGODB.PORT}/${MONGODB.NAME}`);
            return;
        } catch (err) {
            console.log(`MongoDB connection attempt ${i + 1}/${retries} failed. Retrying in ${delay}ms...`);
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }
};

module.exports = connectWithRetry;
