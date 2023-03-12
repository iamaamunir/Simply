const User = require("../models/userModel");
const follower = require("../models/followerModel");
const following = require("../models/followingModel");

exports.follower = async function (req, res, next) {
  try {
    // user to be followed
    const userFollowedId = req.params.id;
    // user that want to do the following
    const userFollowingId = req.user._id;
    // If user is not logged in
    if (await !User.find({ _id: userFollowingId })) {
      return res.status(404).json({
        statud: "fail",
        message: "You have to be logged in before you can follow",
      });
    }
    // if user to be followed doesn't exist
    if (await !User.findById(userFollowedId)) {
      return res.status(404).json({
        status: "fail",
        message: "The user you want to follow does not exist",
      });
    }
    const userFollowed = await User.findById(userFollowedId);

    const userFollowing = await User.findById({ _id: userFollowingId });
    // user gained a new follower
    await follower.create({
      followingId: userFollowed._id,
      follower: { _id: req.user._id },
    });
    // logged in user following list updated
    await following.create({
      following: userFollowed._id,
    });
    //  user model for followers field field is updated
    userFollowed.followers = userFollowed.followers.concat(req.user._id);
    //  user model for following field field is updated
    userFollowing.following = userFollowing.following.concat(userFollowed._id);
    await userFollowed.save();
    await userFollowing.save();
    return res.status(200).json({
      status: "success",
      message: "You are now following this user",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getFollowers = async function (req, res, next) {
  try {
    const user = await User.find({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "The user you want to follow does not exist",
      });
    }
    const userFollowers = await follower
      .find({ followingId: req.user._id })
      .populate("follower", "username");
    console.log(userFollowers);

    return res.status(200).json({
      status: "success",
      userFollowers,
    });
  } catch (error) {
    error.type = "Not Found";
    next(error);
    console.log(error);
  }
};
