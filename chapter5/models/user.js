const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String
});

const user = mongoose.model("usersCollect", userSchema);
module.exports = user;
