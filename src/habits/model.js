const mongoose = require('mongoose');
const { Schema } = mongoose;

// dates = [
//     {data: 1.1.2021, isDone: 'yes | not | nothing'}
// ]

const dateSchema = new Schema({
  date: String,
  isDone: {
    type: String,
    enum: ['true', 'false', 'null'],
    required: true,
  },
});

const habitSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dates: [dateSchema],

  owner: {
    type: String,
    required: true,
  },
});

const HabitModule = mongoose.model('Habit', habitSchema);

module.exports = HabitModule;
