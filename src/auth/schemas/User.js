var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var { loginHistorySchema } = require("./loginHistory");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

module.exports.userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: [3, "Must be at least 3, got {VALUE}"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      // validate: [ isEmail, 'invalid email' ]validate: [ isEmail, 'invalid email' ]
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    loginHistory: [loginHistorySchema],
  },
  { timestamp: true }
);
