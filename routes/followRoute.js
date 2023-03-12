const express = require("express");

const followRouter = express.Router();

const followController = require("../controllers/followController");

followRouter.route("/follow/:id").post(followController.follower);

followRouter.route("/followers").get(followController.getFollowers);

module.exports = followRouter;
