const Joi = require("joi");
const userValidator = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(9)
    .case("lower")
    .trim()
    .required(),
  firstname: Joi.string()
    .pattern(new RegExp("^[a-zA-Z]"))
    .min(5)
    .max(25)
    .required(),
  lastname: Joi.string()
    .pattern(new RegExp("^[a-zA-Z]"))
    .min(5)
    .max(25)
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"], allowUnicode: true },
    })
    .required(),
  phone_number: Joi.string()
    .regex(/^([+])?(\d+)$/)
    // .messages({ "string.pattern.base": `Phone number must have 11 digits.` })
    .required(),
  dob: Joi.date()
    .max("01-01-2008")
    .iso()
    .messages({
      "date.format": `Date format is YYYY-MM-DD`,
      "date.max": `Age must be 15+`,
    })
    .required(),
  sex: Joi.string()
    .valid("male", "female", "non-binary", "others", "choose not to answer")
    .required(),
});

const validateUserMiddelWare = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await userValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    return res.status(406).send(error.details[0].message);
  }
};

module.exports = validateUserMiddelWare;
