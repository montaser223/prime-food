import { restaurant } from "../types/restaurant";
import { DataBase } from "../db/DatabaseDriver";
const DB_URL = process.env.DB_URL!;

export class VendorService implements IVendorService {
  private db: DataBase;

  constructor() {
    this.db = new DataBase(DB_URL)
    
  }
  public async handleRestaurants(buffer: Buffer, vendorName: string): Promise<void> {
    const restaurants: restaurant[] = JSON.parse(buffer.toString() ?? "[]");
    const promises = this.processRestaurants(restaurants, vendorName);
    await Promise.all(promises);
  }

  private processRestaurants(restaurants: restaurant[],vendorName: string) {
    return restaurants.map((restaurant) =>  this.db.bulkWrite([
      {
          updateOne:{
              filter: {
                  name: restaurant.RestaurantName.toLowerCase()
              }, 
              update: {
                  $set: {
                      name: restaurant.RestaurantName,
                      country: restaurant.Country,
                      fullAddress: restaurant.FullAddress,
                      streetAddress: restaurant.Street_address,
                      city: restaurant.City,
                      postalCode: restaurant.PostalCode,
                      location: {
                        type: "Point",
                        coordinates: [+restaurant.Longitude, +restaurant.Latitude],
                      },
                      currency: restaurant.Currency,
                      offer: JSON.parse(restaurant.Offer || "{}"),
                    },
                    $pull: {
                      vendors: {
                          name: vendorName,
                          url: restaurant.URL
                      }
                    }
              }, 
              upsert: true
          }
      },
      {
          updateOne: {
              filter:{
                  name: restaurant.RestaurantName.toLowerCase()
              },
              update: {
                  $push: {
                      vendors: {
                          name: vendorName,
                          url: restaurant.URL,
                          menu: restaurant.menu
                      }
                  }
              }
          }
      }
  ]))
  }
}

interface IVendorService {
  handleRestaurants(buffer: Buffer, vendorName: string): Promise<void>;
}
