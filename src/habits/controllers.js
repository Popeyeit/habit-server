const moment = require('moment');
const HabitModule = require('./model');
const {
  setDateEveryDay,
  setDateTwoDays,
  setDateThreeDays,
} = require('./services');
const { momentFormat } = require('./services');

const todayDate = moment().format(momentFormat);

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

const getHabits = async (req, res, next) => {
  try {
    const { user } = req;
    const { _id } = user;
    const { currentDate = todayDate } = req.body;

    const result = await HabitModule.find({ owner: _id });

    const filteredResult = result.reduce((newArray, el) => {
      let totalHabitDone = 0;
      const hasDate = el.dates.filter(el => {
        el.isDone === 'true' ? (totalHabitDone += 2.5) : false;
        return el.date === currentDate;
      });

      if (hasDate.length > 0) {
        newArray.push({
          title: el.title,
          _id: el._id,
          date: hasDate,
          totalHabitDone,
        });
      }
      totalHabitDone = 0;

      return newArray;
    }, []);

    res.status(200).json(filteredResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHabit,
  getHabits,
};
