const mongoose = require("mongoose");

const followersSchema = new mongoose.Schema({
  followingId: { type: String },
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("followers", followersSchema);
