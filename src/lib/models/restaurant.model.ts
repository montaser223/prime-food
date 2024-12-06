import { NextFunction } from "express";
import { model, Schema } from "mongoose";

const restaurantSchema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
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
  vendors: [
    {
      name: String,
      url: String,
      menu: [],
    },
  ],
});

interface IRestaurant extends Document {
    name: string
}

// restaurantSchema.post<IRestaurant>("find",function(next: NextFunction){
//     console.log(this);
    
//     // this.name.replace(/(\w)(\w*)/g,
//     //     (_,g1,g2) => g1.toUpperCase() + g2.toLowerCase());

//     next();
// });

// restaurantSchema.index()

restaurantSchema.index({location: "2dsphere"});

export const Restaurant = model("restaurants", restaurantSchema);
