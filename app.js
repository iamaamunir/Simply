const express = require("express");
const bodyParser = require("body-parser");
require("./authentication/auth");

const app = express();
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

// MIDDLEWARES

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/v1", postRouter);
app.use("/api/v1", userRouter);

//HOME ROUTES
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to SIMPLY homepage",
  });
});

module.exports = app;
