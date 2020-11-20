const HabitModule = require('./model');
const {
  setDateEveryDay,
  setDateTwoDays,
  setDateThreeDays,
} = require('./services');

const createHabit = async (req, res, next) => {
  try {
    const { user } = req;
    const { body } = req;
    const { _id } = user;
    const { repeats } = body;
    const { startDate } = body;

    let dates = [];
    if (repeats.length === 3) {
      dates = setDateThreeDays(startDate, repeats);
    }
    if (repeats[0] === 'everyTwoDays') {
      dates = setDateTwoDays(startDate);
    }
    if (repeats[0] === 'everyday') {
      dates = setDateEveryDay(startDate);
    }
    const habit = {
      ...body,
      owner: _id,
      dates,
    };
    const result = await HabitModule.create(habit);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
//
const getHabits = async (req, res, next) => {
  try {
    const { user } = req;
    const { _id } = user;
    const result = await HabitModule.find({ owner: _id });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHabit,
  getHabits,
};
