const passport = require("passport");

const express = require("express");
// const userValidation = require("../validators/user.Validator");
const userRouter = express.Router();

const userController = require("../controllers/userControllers");

userRouter.post(
  "/signup",

  passport.authenticate("signup", { session: false }),
  userController.signUp
);
userRouter.post("/login", userController.login);

module.exports = userRouter;
