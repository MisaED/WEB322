var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports.loginHistorySchema = new Schema({
  dateTime: {
    type: Date,
  },
  userAgent: {
    type: String,
  },
});
