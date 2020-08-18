const mongoose = require('mongoose');
const db = process.env.MONGO_URI
const colors = require('colors');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log(`Mongo is running, sonny(?) boy`.magenta.bold)
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;