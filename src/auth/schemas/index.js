var mongoose = require("mongoose");

var { userSchema } = require("./User");

var User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
