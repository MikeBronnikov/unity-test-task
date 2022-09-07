import { Schema, model } from 'mongoose';

const schema = new Schema({
  country: {
    type: String,
    require: [true, 'country is required!'],
  },
  city: {
    type: String,
  },
  name: {
    type: String,
  },
  location: {
    type: Object,
  },
  students: {
    type: Array,
  },
});

export const First = model('First', schema);
