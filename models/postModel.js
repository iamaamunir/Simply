const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  post: {
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
  tagFriends: [String],
  activity: {
    type: String,
  },
  feeling: {
    // use enum instead of joi valid which is not working
    type: String,
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
