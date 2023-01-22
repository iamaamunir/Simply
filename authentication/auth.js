const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local").Strategy;

const userModel = require("../models/userModel");
const CONFIG = require("../config/config");
const JWT_SECRET = CONFIG.JWT_SECRET;

// Auth endpoints with JWTStrategy
passport.use(
  new JWTStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// AUth email and password with passport-local

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const user = await userModel.create({
          email,
          firstname,
          lastname,
          password,
          username,
        });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ username });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
          return done(null, false, { message: "Password is incorrect" });
        }
        return done(null, user, { message: "Login successfull" });
      } catch (err) {
        return done(err);
      }
    }
  )
);
