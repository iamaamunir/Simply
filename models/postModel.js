const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  // create author field here
  author: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  tagFriends: [String],
  activity: {
    type: String,
  },
  feeling: {
    type: String,
    enum: ["like", "angry", "love", "sad", "happy"],
  },
  location: {
    type: String,
  },
  images: [{}],
  videos: [{}],
  reactions: [
    // maybe i will remodel this array.
    {
      username: String,
      reaction: String,
    },
  ],
});

module.exports = mongoose.model("posts", postSchema);
