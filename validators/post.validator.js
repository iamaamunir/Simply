const Joi = require("joi");
const postValidator = Joi.object({
  body: Joi.string().alphanum().max(500).trim().required(),
  createAt: Joi.date().min("now").iso().timestamp(),
  updatedAt: Joi.date().greater("now").iso().timestamp(),
  feeling: Joi.string().valid("happy", "hopeful", "exicted", "sad"),
  location: Joi.string(),
  activity: Joi.string(),
  tagFriends: Joi.array().items(
    Joi.object({
      username: Joi.string().alphanum().min(5).max(9).case("lower").trim(),
    })
  ),
  reactions: Joi.array().items(
    Joi.object({
      username: Joi.string().alphanum().min(5).max(9).case("lower").trim(),
      reaction: Joi.string().valid("like", "angry", "love", "sad", "happy"),
    })
  ),
});

const validatePostMiddelWare = async (req, res, next) => {
  const postPayload = req.body;
  try {
    await postValidator.validateAsync(postPayload);
    next();
  } catch (error) {
    return res.status(406).send(error.details[0].message);
  }
};

module.exports = validatePostMiddelWare;
