const moment = require('moment');
const momentFormat = 'dddd.DD.MMMM.YYYY';

const createObj = (dateStart, index) => {
  const date = moment(dateStart, momentFormat)
    .add(index, 'day')
    .format(momentFormat);
  const obj = { date, isDone: 'nothing' };
  return obj;
};

exports.setDateThreeDays = (
  dateStart,
  arrDays = ['Monday', 'Friday', 'Wednesday'],
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