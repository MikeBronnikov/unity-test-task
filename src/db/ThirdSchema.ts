import { Schema, model } from 'mongoose';

const schema = new Schema({
  _id: {
    type: String,
    require: [true, 'country is required!'],
  },
  allDiffs: {
    type: Array,
  },
  count: {
    type: Array,
  },
  longitude: {
    type: Array,
  },
  latitude: {
    type: Array,
  },
});

export const Third = model('Third', schema);
