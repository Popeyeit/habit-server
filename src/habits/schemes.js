const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');

exports.rulesToGetHabits = Joi.object({
  currentDate: Joi.string(),
});

exports.rulesCreateHabit = Joi.object({
  title: Joi.string().required().max(100),
  startDate: Joi.string().required(),
  repeats: Joi.array().required(),
});

exports.habitIdSchema = Joi.object({
  habitId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid habit id. Must be object id');
    }
    return value;
  }),
  dateId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid habit id. Must be object id');
    }
    return value;
  }),
});

exports.rulesChangeHabit = Joi.object({ status: Joi.string() });
