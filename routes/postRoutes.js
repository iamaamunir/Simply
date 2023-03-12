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

postRouter.route("/post/react/:id").patch(postControllers.reactToPost);
postRouter.route("/newsfeed").get(postControllers.newsFeed);
postRouter.route("/newsFeed/:id").get(postControllers.newsFeedById);

postRouter.route("/post/comment/:id").post(postControllers.addComment);
module.exports = postRouter;
