const moment = require('moment');
require('moment/locale/ru');
moment.locale('ru');
const momentFormat = 'dddd.DD.MMMM.YYYY';

const createObj = (dateStart, index) => {
  const date = moment(dateStart, momentFormat)
    .add(index, 'day')
    .format(momentFormat);
  const obj = { date, isDone: 'null' };
  return obj;
};

exports.setDateThreeDays = (
  dateStart,
  arrDays = ['Понедельник', 'Пятница', 'Среда'],
) => {
  const arrResult = [];

  for (let index = 0; arrResult.length < 40; index++) {
    const weekDay = moment(dateStart, momentFormat)
      .add(index, 'day')
      .format('dddd');

    if (weekDay === arrDays[0]) {
      const obj = createObj(dateStart, index);
      arrResult.push(obj);
    }
    if (weekDay === arrDays[1]) {
      const obj = createObj(dateStart, index);
      arrResult.push(obj);
    }
    if (weekDay === arrDays[2]) {
      const obj = createObj(dateStart, index);
      arrResult.push(obj);
    }
  }
  return arrResult;
};

exports.setDateEveryDay = dateStart => {
  const arrResult = [];
  for (let index = 0; arrResult.length < 40; index++) {
    const obj = createObj(dateStart, index);
    arrResult.push(obj);
  }

  return arrResult;
};

exports.setDateTwoDays = dateStart => {
  const arrResult = [];
  for (let index = 0; arrResult.length < 40; index++) {
    if (index % 2) {
      const obj = createObj(dateStart, index);
      arrResult.push(obj);
    }
  }
  return arrResult;
};

exports.filteredArray = (arr, currentDate) => {
  const filteredResult = arr.reduce((newArray, el) => {
    const hasDate = el.dates.filter(el => {
      return el.date === currentDate;
    });

    if (hasDate.length > 0) {
      newArray.push({
        title: el.title,
        _id: el._id,
        date: hasDate,
        totalHabitDone: el.totalHabitDone,
      });
    }

    return newArray;
  }, []);
  return filteredResult;
};
