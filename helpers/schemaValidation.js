const Joi = require("joi");

const member = Joi.object({
  _id: Joi.string(),
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  dob: Joi.string(),
  gender: Joi.string().min(4),
  address: Joi.string().min(10),
  city: Joi.string().min(3),
  state: Joi.string().min(3),
  country: Joi.string().min(3),
  zipCode: Joi.string().min(5).max(5),
  branchIds: Joi.array().items(Joi.string()),
  status: Joi.string().valid("1", "2"),
  password: Joi.string().min(8),
});

module.exports = { member };
