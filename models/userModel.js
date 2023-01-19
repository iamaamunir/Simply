const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  phone_number: {
    type: Number,
  },
  birthday: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;

  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

module.exports = mongoose.model("users", userSchema);
