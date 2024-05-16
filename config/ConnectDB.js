const mongoose = require("mongoose");
function ConnectDB() {
  try {
    mongoose.connect(process.env.DATABASE_URI);
    console.log("Connect database");
  } catch (error) {
    console.log(error);
  }
}

module.exports = ConnectDB;
