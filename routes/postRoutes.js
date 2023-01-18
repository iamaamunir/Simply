const express = require("express");

const postRouter = express.Router();

const postControllers = require("../controllers/postControllers");

postRouter
  .route("/post")
  .get(postControllers.getAllPost)
  .post(postControllers.createPost);

module.exports = postRouter;
