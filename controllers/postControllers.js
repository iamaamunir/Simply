const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

exports.createPost = async function (req, res) {
  try {
    const {
      post,
      tagFriends,
      location,
      activity,
      createdAt,
      images,
      videos,
      reactions,
      feeling,
    } = req.body;
    const friends = tagFriends.map((data) => data.username);
    const users = await userModel.find({ username: friends });
    const username = users.map((u) => u.username);

    const postDetails = await postModel.create({
      post: post,
      tagFriends: username.toString(),
      location: location,
      activity: activity,
      images: images,
      videos: videos,
      createdAt: createdAt,
      feeling: feeling,
    });
    res.status(201).json({
      status: "success",
      data: postDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", error: err });
  }
};

exports.getAllPost = function (req, res) {
  res.status(500).json({
    status: "fail",
    message: "in progress",
  });
};
