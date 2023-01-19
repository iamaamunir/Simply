const jwt = require("jsonwebtoken");
const passport = require("passport");
const CONFIG = require("../config/config");
const JWT_SECRET = CONFIG.JWT_SECRET;

exports.signUp = async (req, res, next) => {
  try {
    res.status(201).json({
      status: "success",
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(info.message);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          email: user.email,
        };
        const token = jwt.sign({ user: body }, JWT_SECRET, {
          expiresIn: "1hr",
        });
        return res.status(200).json({ token });
      });

      next();
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};
