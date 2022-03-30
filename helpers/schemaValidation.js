const Joi = require("joi");

const member = Joi.object({
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  phoneNumber: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string().min(4),
  city: Joi.string().min(3),
  state: Joi.string().min(3),
  zipCode: Joi.string().min(5).max(5),
  street: Joi.string().min(10),
  startDate: Joi.string(),
  branchIds: Joi.array().items(Joi.string()),
  status: Joi.string().valid("1", "2"),
});

module.exports = { member };
