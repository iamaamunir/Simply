const User = require("../models/userModel");
const follow = require("../models/followerModel");
const following = require("../models/followingModel");

exports.follower = async function (req, res, next) {
  try {
    const userFollowedId = req.params.id;
    const userFollowingId = req.user._id;
    if (await !User.find({ _id: userFollowingId })) {
      return res.status(404).json({
        statud: "fail",
        message: "You have to be logged in before you can follow",
      });
    }
    if (await !User.findById(userFollowedId)) {
      return res.status(404).json({
        status: "fail",
        message: "The user you want to follow does not exist",
      });
    }
    const userFollowed = await User.findById(userFollowedId);
    console.log(userFollowed);
    const userFollowing = await User.findById({ _id: userFollowingId });
    console.log(userFollowing);
    const followers = await follow.create({
      follower: { _id: req.user._id },
    });
    const yourFollowing = await following.create({
      following: userFollowed._id,
    });
    userFollowed.followers = userFollowed.followers.concat(req.user._id);
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
