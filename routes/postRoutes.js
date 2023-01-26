const express = require("express");

const postRouter = express.Router();

const postControllers = require("../controllers/postControllers");

postRouter
  .route("/post")
  .get(postControllers.getAllPost)
  .post(postControllers.createPost);
postRouter
  .route("/post/:id")
  .patch(postControllers.editPost)
  .delete(postControllers.deletePost);
postRouter.route("/newsfeed").get(postControllers.newsFeed);
postRouter.route("/newsFeed/:id").get(postControllers.newsFeedById);

module.exports = postRouter;
