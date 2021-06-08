import mongoose, { Document, Schema } from 'mongoose';

export const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    profileImageURL: {
      type: String,
      required: true,
    },
    imageURLList: [
      {
        type: String,
        required: true,
      },
    ],
    ratingList: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const RestaurantModel = mongoose.model<RestaurantDoc>('Restaurant', RestaurantSchema);

interface Restaurant {
  name: string;
  lat: string;
  lng: number;
  profileImageURL: string;
  imageURLList: string[];
  ratingList: RestaurantRating[];
}

interface RestaurantRating {
  userId: string;
  rating: number;
}

export interface RestaurantDoc extends Restaurant, Document {}

export default RestaurantModel;
