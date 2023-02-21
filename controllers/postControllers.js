const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

exports.createPost = async function (req, res, next) {
  try {
    const {
      body,
      location,
      activity,
      createdAt,
      images,
      videos,
      comment,
      feeling,
    } = req.body;
    let friendsUsername;
    if (req.body.tagFriends) {
      const tagFriends = req.body.tagFriends;

      const users = await User.find({ username: tagFriends });

      if (users === []) {
        return res.status(404).json({
          status: "fail",
          message: "Users don't exist",
        });
      }

      friendsUsername = users
        .map((el) => el.username)
        .toString()
        .split(",");
    } else {
      friendsUsername = [];
    }

    const mainUser = await User.findById(req.user._id);

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
    const post = new Post(postDetails);
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
      const posts = await Post.find({ author: { _id: req.user._id } })
        .limit(limit)
        .populate("author", "username");
      res.status(200).json({
        status: "success",
        data: {
          posts,
        },
      });
    } else {
      const posts = await Post.find({ author: { _id: req.user._id } }).populate(
        "author",
        "username"
      );
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
      const posts = await Post.find()
        .limit(limit)
        .populate("author", "username");
      res.status(200).json({
        status: "success",
        data: {
          posts,
        },
      });
    } else {
      const posts = await Post.find().populate("author", "username");
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
    const post = await Post.find({ _id: id }).populate("author", "username");
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

    const currentUser = await User.find({ _id: req.user._id });
    if (currentUser) {
      await Post.findByIdAndUpdate(id, bodyObj, {
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
    const currentUser = await User.find({ _id: req.user._id });
    if (currentUser) {
      await Post.findByIdAndDelete(id);

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

exports.reactToPost = async function (req, res, next) {
  try {
    const id = req.params.id;
    const reaction = req.body;
    const post = await Post.findById(id);
    const currentUser = req.user.email;
    const user = await User.find({ email: currentUser });

    const username = user.map((el) => el.username).toString();

    const reactor = reaction.reactions.map((el) => el.username).toString();
    post.reactions.forEach(function (obj) {
      if (obj.username === reactor) {
        const filtered = post.reactions.filter(function (el) {
          return el.username !== reactor;
        });
        post.reactions = filtered;
      }
    });
    if (username === reactor) {
      post.reactions.push(reaction.reactions[0]);
      await post.save();

      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "fail" });
    }
  } catch (error) {
    error.type = "Not Found";
    next(error);
    console.log(error);
  }
};

exports.addComment = async function (req, res, next) {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const currentUser = await User.find({ _id: req.user._id });

    if (currentUser) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          status: "fail",
          message: "Post not available",
        });
      }

      const comment = new Comment({
        text: text,
        post: post._id,
        user: post.author,
      });
      await comment.save();
      post.comments.push(comment);

      await post.save();
      return res.status(204).json({ status: "success", data: post });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "You have to be logged in before you can comment",
      });
    }
  } catch (error) {
    next(error);
  }
};
