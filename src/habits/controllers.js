const moment = require('moment');
const HabitModule = require('./model');
const {
  setDateEveryDay,
  setDateThreeDays,
  setDateTwoDays,
  filteredArray,
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
      totalHabitDone: 0,
    };
    const result = await HabitModule.create(habit);

    const momentFormat = 'dddd.DD.MMMM.YYYY';
    const todayDate = moment().format(momentFormat);

    if (todayDate === result.dates[0].date) {
      const resHabit = {
        title: result.title,
        _id: result._id,
        date: [result.dates[0]],
        totalHabitDone: result.totalHabitDone,
      };
      res.status(201).send([resHabit]);
      return;
    }
    res.status(201).send([]);
    return;
  } catch (error) {
    next(error);
  }
};

const getHabits = async (req, res, next) => {
  try {
    const { user } = req;
    const { _id } = user;
    const { currentDate = todayDate } = req.query;

    const result = await HabitModule.find({ owner: _id });

    const filteredResult = filteredArray(result, currentDate);

    res.status(200).json(filteredResult);
  } catch (error) {
    next(error);
  }
};

const changeHabit = async (req, res, next) => {
  try {
    const { habitId, dateId } = req.params;
    const { status } = req.body;

    const result = await HabitModule.findById({
      _id: habitId,
    });

    const indexHabit = result.dates.findIndex(el => {
      return el._id.toString() === dateId;
    });

    if (indexHabit === -1) {
      res.status(404).send('not that id');
      return;
    }

    if (result.dates[indexHabit].isDone === status) {
      res.status(418).send('I am a teapot');
      return;
    }

    const newArrResult = result.dates.map(el => {
      return el._id.toString() === dateId
        ? { _id: el._id, isDone: status, date: el.date }
        : el;
    });

    let totalHabitDone =
      status === 'true'
        ? (result.totalHabitDone += 2.5)
        : (result.totalHabitDone -= 2.5);

    if (totalHabitDone < 0) {
      totalHabitDone = 0;
    }

    if (totalHabitDone > 100) {
      totalHabitDone = 100;
    }

    const updatedResult = await HabitModule.findOneAndUpdate(
      { _id: habitId },
      { totalHabitDone, dates: newArrResult },
      { new: true },
    );

    res.status(201).send({
      title: updatedResult.title,
      _id: updatedResult._id,
      date: updatedResult.dates[indexHabit],
      totalHabitDone: updatedResult.totalHabitDone,
    });
  } catch (error) {}
};

module.exports = {
  createHabit,
  getHabits,
  changeHabit,
};
