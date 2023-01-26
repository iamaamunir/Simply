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

      feeling,
    } = req.body;
    let friendsUsername;
    if (req.body.tagFriends) {
      const tagFriends = req.body.tagFriends;

      const users = await userModel.find({ username: tagFriends });

      friendsUsername = users
        .map((el) => el.username)
        .toString()
        .split(",");
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

exports.newsFeed = async function (req, res, next) {
  try {
    const limit = parseInt(req.query.limit);
    if (limit) {
      const posts = await postModel
        .find()
        .limit(limit)
        .populate("author", "username");
      res.status(200).json({
        status: "success",
        data: {
          posts,
        },
      });
    } else {
      const posts = await postModel.find().populate("author", "username");
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

exports.newsFeedById = async function (req, res, next) {
  try {
    const id = req.params.id;
    const post = await postModel
      .find({ _id: id })
      .populate("author", "username");
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    error.type = "Not Found";
    next(error);
    console.log(error);
  }
};

exports.editPost = async function (req, res, next) {
  try {
    const id = req.params.id;
    const bodyObj = { ...req.body };

    bodyObj.updatedAt = Date.now();
    const excludedFields = ["createAt"];
    excludedFields.forEach((el) => delete bodyObj[el]);

    const currentUser = await userModel.find({ _id: req.user._id });
    if (currentUser) {
      await postModel.findByIdAndUpdate(id, bodyObj, {
        new: true,
        runValidators: true,
      });

      return res.status(204).json({
        status: "success",
      });
    } else {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized",
      });
    }
  } catch (error) {
    error.type = "Not Found";
    next(error);
    console.log(error);
  }
};

exports.deletePost = async function (req, res, next) {
  try {
    const id = req.params.id;
    const currentUser = await userModel.find({ _id: req.user._id });
    if (currentUser) {
      await postModel.findByIdAndDelete(id);

      return res.status(200).json({
        status: "success",
        message: "Deleted Successfully",
      });
    } else {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized",
      });
    }
  } catch (error) {
    error.type = "Not Found";
    next(error);
    console.log(error);
  }
};
