const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const postRouter = require("./routes/postRoutes");

// MIDDLEWARES

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/v1", postRouter);

//HOME ROUTES
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to SIMPLY homepage",
  });
});

module.exports = app;
