import mongoose, { Schema } from 'mongoose';

export const nftModel = mongoose.model(
  'nfts',
  new Schema({
    token_id: {
      type: String,
      required: true,
    },
    collection_address: {
      type: String,
      required: true,
    },
    owner_address: {
      type: String,
      required: true,
    },
    nft_type: {
      type: Number,
      required: true,
    },
    nft_name: {
      type: String,
      required: true,
    },
    nft_image: {
      type: String,
      required: true,
    },
    nft_rank: {
      type: Number,
      require: true,
    },
    listing: {
      type: Boolean,
      default: false,
      required: true,
    },
    power: {
      type: Number,
      default: 0,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    equip: {
      type: Boolean,
      default: false,
    },
  }),
);
