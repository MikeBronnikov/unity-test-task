import { Schema, model } from 'mongoose';

const schema = new Schema({
  country: {
    type: String,
    require: [true, 'country is required!'],
  },
  overallStudents: {
    type: Number,
  },
});

export const Second = model('Second', schema);
