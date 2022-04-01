const Joi = require("joi");

const member = Joi.object({
  _id: Joi.string(),
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  phoneNumber: Joi.string().allow(null).allow(""),
  email: Joi.string().email(),
  dob: Joi.string().optional().allow(null).allow(""),
  gender: Joi.string().min(4).optional().allow(null).allow(""),
  address: Joi.string().min(10).allow(null).allow(""),
  city: Joi.string().min(3).allow(null).allow(""),
  state: Joi.string().min(3).allow(null).allow(""),
  country: Joi.string().min(3).allow(null).allow(""),
  zipCode: Joi.string().min(5).max(5).allow(null).allow(""),
  branchIds: Joi.array().items(Joi.string()),
  status: Joi.string().valid("1", "2"),
  password: Joi.string().min(8),
});

module.exports = { member };
