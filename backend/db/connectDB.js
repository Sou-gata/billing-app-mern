const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(`mongodb://0.0.0.0:27017/products`);
        console.log("✅ DB connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
module.exports = connectDb;
