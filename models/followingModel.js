const mongoose = require("mongoose");

const followingSchema = new mongoose.Schema({
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("following", followingSchema);
