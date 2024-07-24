import mongoose, { Schema } from 'mongoose';

export const tbaModel = mongoose.model(
  'tbas',
  new Schema({
    tba_address: {
      type: String,
      required: true,
    },
    collection_address: {
      type: String,
      required: true,
    },
    token_id: {
      type: Number,
      required: true,
    },
    owner_address: {
      type: String,
      required: true,
    },
    tba_image: {
      type: String,
      required: true,
    },
    tba_name: {
      type: String,
      required: true,
    },
    listing: {
      type: Boolean,
      default: false,
      required: true,
    },
    point: {
      type: Number,
      default: 0,
      required: true,
    },
    price: {
      type: String,
      default: 0,
      required: true,
    },
    power: {
      type: Number,
      default: 0,
      required: true,
    },
    claimed: {
      type: Number,
      default: 0,
    },
    genesis_image: {
      type: String,
      required: true,
    },
  }),
);
