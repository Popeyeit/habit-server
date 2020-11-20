const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');

exports.rulesCreateHabit = Joi.object({
  title: Joi.string().required().max(100),
  startDate: Joi.string().required(),
  repeats: Joi.array().required(),
});

exports.habitIdSchema = Joi.object({
  contactId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid contact id. Must be object id');
    }
    return value;
  }),
});
