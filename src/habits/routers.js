const { Router } = require('express');
const habitsRoute = Router();
const { authorize } = require('../user/controllers');
const { handleValidate } = require('../helpers/validate');
const {
  rulesCreateHabit,
  rulesToGetHabits,
  habitIdSchema,
  rulesChangeHabit,
} = require('./schemes');
const { createHabit, getHabits, changeHabit } = require('./controllers');

habitsRoute.get(
  '/',
  authorize,
  handleValidate(rulesToGetHabits, 'query'),
  getHabits,
);
habitsRoute.post('/', authorize, handleValidate(rulesCreateHabit), createHabit);
habitsRoute.patch(
  '/:habitId/:dateId',
  authorize,
  handleValidate(habitIdSchema, 'params'),
  handleValidate(rulesChangeHabit),
  changeHabit,
);
habitsRoute.delete('/:deleteId');

module.exports = habitsRoute;
