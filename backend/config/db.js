const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `🔥 MongoDB Connected → ${conn.connection.host}`.green.bold
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`.red.bold);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDB;

