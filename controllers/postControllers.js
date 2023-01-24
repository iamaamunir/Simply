const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

exports.createPost = async function (req, res, next) {
  try {
    const {
      body,
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

    const mainUser = await userModel.findById(req.user._id);

    const postDetails = {
      body: body,
      tagFriends: username.toString(),
      location: location,
      activity: activity,
      images: images,
      videos: videos,
      createdAt: createdAt,
      feeling: feeling,
      author: { _id: req.user._id },
      reaction,
    };
    const post = new postModel(postDetails);
    const savedPost = await post.save();
    mainUser.posts = mainUser.posts.concat(savedPost._id);
    await mainUser.save();

    return res.status(201).json({
      status: "success",
      message: "Post successfully created.",
    });
  } catch (error) {
    error.type = "Not Found";
    res.status(404).json({ status: "fail", message: error });
    next(error);
  }
};

exports.getAllPost = function (req, res) {
  res.status(500).json({
    status: "fail",
    message: "in progress",
  });
};
