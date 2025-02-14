import { restaurant } from "../types/restaurant";
import { DataBase } from "../db/DatabaseDriver";
import { Logger } from "../helpers/logger";
import { Config } from "../../configuration";
const DB_URL = process.env.DB_URL!;

export class VendorService implements IVendorService {
  private db: DataBase;
  private logger: Logger;
  constructor() {
    this.db = new DataBase(DB_URL)
    this.logger = new Logger(Config.logs)
  }
  public async handleRestaurants(restaurants: restaurant[], vendorName: string): Promise<void> {
    const promises = this.processRestaurants(restaurants, vendorName);
    await Promise.all(promises);
  }

  private processRestaurants(restaurants: restaurant[],vendorName: string) {
    const promises = [];
    for (const restaurant of restaurants) {
      promises.push(this.db.bulkWrite([
        {
            updateOne:{
                filter: {
                    name: restaurant['Restaurant Name'],
                    fullAddress:  restaurant.Address,
                    // [`${vendorName}_url`]: restaurant.URL
                }, 
                update: {
                    $set: {
                        name: restaurant['Restaurant Name'],
                        country: restaurant.Country,
                        fullAddress: restaurant.Address,
                        streetAddress: restaurant['Street Address'],
                        city: restaurant.City,
                        postalCode: restaurant['Postal Code'],
                        location: {
                          type: "Point",
                          coordinates: [+restaurant.Longitude, +restaurant.Latitude],
                        },
                        currency: restaurant.Currency,
                        offer: restaurant.Offer === 'N/A' ? null : JSON.parse(restaurant.Offer || "{}"),
                        deliveryTime: restaurant['Delivery Time'],
                        restaurantImage: restaurant["Restaurant Image"],
                        reviews: restaurant["Restaurant Reviews"],
                        rate: restaurant['Restaurant Rating'],
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
                  name: restaurant['Restaurant Name'],
                  fullAddress:  restaurant.Address
                },
                update: {
                    $push: {
                        vendors: {
                            name: vendorName,
                            url: restaurant.URL,
                            // menu: restaurant.Menu
                        }
                    }
                }
            }
        }
    ]))
    }

    return promises;
  
  }

}

interface IVendorService {
  handleRestaurants(buffer: restaurant[], vendorName: string): Promise<void>;
}
