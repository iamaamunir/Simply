const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const CONFIG = require("../config/config");

function connectToDb() {
  mongoose.connect(CONFIG.MONGODB_URL);
  mongoose.connection.on("connected", () => {
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  });
  mongoose.connection.on("error", (err) => {
    console.log("ERROR CONNECTING TO DB");
    console.log(err);
  });
}
module.exports = connectToDb;
