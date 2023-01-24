const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

exports.createPost = async function (req, res, next) {
  try {
    const {
      body,

      location,
      activity,
      createdAt,
      images,
      videos,
      reactions,
      feeling,
    } = req.body;
    let friendsUsername;
    if (req.body.tagFriends) {
      const tagFriends = req.body.tagFriends;

      const friends = tagFriends.toString();

      const users = await userModel.find({ username: tagFriends });

      friendsUsername = users
        .map((el) => el.username)
        .toString()
        .split(",");
      console.log(friendsUsername);
    } else {
      friendsUsername = [];
    }

    const mainUser = await userModel.findById(req.user._id);

    const postDetails = {
      body: body,
      tagFriends: friendsUsername,
      location: location,
      activity: activity,
      images: images,
      videos: videos,
      createdAt: createdAt,
      feeling: feeling,
      author: { _id: req.user._id },
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
    next(error);
    // return res.status(404).json({ status: "fail", message: error });
  }
};

exports.getAllPost = async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit);
    if (limit) {
      const posts = await postModel
        .find({ author: { _id: req.user._id } })
        .limit(limit)
        .populate("author", "username");
      res.status(200).json({
        status: "success",
        data: {
          posts,
        },
      });
    } else {
      const posts = await postModel
        .find({ author: { _id: req.user._id } })
        .populate("author", "username");
      res.status(200).json({
        status: "success",
        data: {
          posts,
        },
      });
    }
  } catch (error) {
    error.type = "Not Found";
    next(error);
    console.log(error);
  }
};
