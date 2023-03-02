const express = require("express");

const followRouter = express.Router();

const followController = require("../controllers/followController");

followRouter.route("/follow/:id").post(followController.follower);
module.exports = followRouter;
