const passport = require("passport");

const express = require("express");
const userValidation = require("../validators/user.validator");
const userRouter = express.Router();

const userController = require("../controllers/userControllers");

userRouter.post(
  "/signup",
  userValidation,
  passport.authenticate("signup", { session: false }),
  userController.signUp
);
userRouter.post("/login", userController.login);

module.exports = userRouter;
