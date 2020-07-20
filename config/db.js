const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URI + process.env.DB_NAME;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log("MongoDB connected!");
    }
    catch (err) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;