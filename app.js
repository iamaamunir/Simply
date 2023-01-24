const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./authentication/auth");

const app = express();
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

// MIDDLEWARES

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((error, req, res, next) => {
  if (error.type == "Not Found") {
    res.status(404).json({ status: "fail", message: "Not Found" });
  }
  next();
});

app.use("/api/v1", userRouter);

app.use(
  "/api/v1",
  passport.authenticate("jwt", { session: false }),
  postRouter
);

//HOME ROUTES
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to SIMPLY homepage",
  });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});
module.exports = app;
