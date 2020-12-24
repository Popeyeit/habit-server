const { Router } = require('express');
const habitsRoute = Router();
const { authorize } = require('../user/controllers');
const { handleValidate } = require('../helpers/validate');
const {
  rulesCreateHabit,
  rulesToGetHabits,
  habitIdSchema,
  rulesChangeHabit,
  rulesSettingHabit,
} = require('./schemes');
const {
  createHabit,
  getHabits,
  changeHabit,
  deleteHabit,
  settingHabit,
} = require('./controllers');

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

habitsRoute.delete(
  '/:habitId',
  authorize,
  handleValidate(habitIdSchema, 'params'),
  deleteHabit,
);

habitsRoute.patch(
  '/:habitId',
  authorize,
  handleValidate(habitIdSchema, 'params'),
  handleValidate(rulesSettingHabit),
  settingHabit,
);

module.exports = habitsRoute;
