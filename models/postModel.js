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
  tagFriends: [
    {
      username: String,
    },
  ],
  activity: {
    type: String,
  },
  location: {
    type: String,
  },
  images: [{}],
  videos: [{}],
  likes: [{}],
});

module.exports = mongoose.model("posts", postSchema);
