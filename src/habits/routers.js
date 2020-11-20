const { Router } = require('express');
const habitsRoute = Router();
const { authorize } = require('../user/controllers');
const { handleValidate } = require('../helpers/validate');
const { rulesCreateHabit } = require('./schemes');
const { createHabit, getHabits } = require('./controllers');

habitsRoute.get('/', authorize, getHabits);
habitsRoute.post('/', authorize, handleValidate(rulesCreateHabit), createHabit);
habitsRoute.delete('/:deleteId');
habitsRoute.patch('/:changedId');

module.exports = habitsRoute;
