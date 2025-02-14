import mongoose, { model, Schema } from "mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

const restaurantSchema = new Schema({
  name: {
    type: String,
    // unique: true,
    // lowercase: true,
    trim: true,
    // index: true,
  },
  country: String,
  fullAddress: String,
  streetAddress: String,
  city: String,
  postalCode: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number, Number],
      required: true,
    },
  },
  currency: String,
  offer: Object,
  deliveryTime: String,
  restaurantImage: String,
  reviews: String,
  rate: String,
  // [:string]: String,
  vendors: [
    {
      name: String,
      url: String,
      menu: [],
    },
  ],
}, {
  strict: false
});

restaurantSchema.index({location: "2dsphere"});

restaurantSchema.plugin(mongoosePagination);

type IRestaurant = mongoose.Document & {
  location: {
    type: String,
    coordinates:  [Number, Number]
  },
  offer: Object
}


export const Restaurant: Pagination<IRestaurant> = model<IRestaurant, Pagination<IRestaurant>>("restaurants", restaurantSchema);
