import { existRestaurantRatingError, invalidRestaurantIdError } from 'src/error/ErrorObject';
import RestaurantModel from 'src/models/Restaurant.model';
import { Resolvers } from 'src/types/graphql';
const resolvers: Resolvers = {
  Query: {
    getRestaurantList: async (_, args, ctx) => {
      const { minLat, maxLat, minLng, maxLng } = args;
      const MAX_LAT_DIFF = 0.014;
      const MAX_LNG_DIFF = 0.007;
      let restaurantMinLat = minLat;
      let restaurantMaxLat = maxLat;
      let restaurantMinLng = minLng;
      let restaurantMaxLng = maxLng;
      if (maxLat - minLat > MAX_LAT_DIFF) {
        restaurantMinLat = (maxLat + minLat) / 2 - MAX_LAT_DIFF / 2;
        restaurantMaxLat = (maxLat + minLat) / 2 + MAX_LAT_DIFF / 2;
      }
      if (maxLng - minLng > MAX_LNG_DIFF) {
        restaurantMinLng = (maxLng + minLng) / 2 - MAX_LNG_DIFF / 2;
        restaurantMaxLng = (maxLng + minLng) / 2 + MAX_LNG_DIFF / 2;
      }
      const restaurantList = await RestaurantModel.find()
        .where('lat')
        .gt(restaurantMinLat)
        .lt(restaurantMaxLat)
        .where('lng')
        .gt(restaurantMinLng)
        .lt(restaurantMaxLng);
      return restaurantList;
    },
    getRestaurant: async (_, args, ctx) => {
      const { _id } = args;
      const restaurant = await RestaurantModel.findById(_id);
      if (!restaurant) {
        throw invalidRestaurantIdError;
      }
      return restaurant;
    },
  },
  Restaurant: {
    rating: async (parent, args, ctx) => {
      let restaurantRating = 0;
      parent.ratingList.forEach((rating) => {
        restaurantRating += rating.rating;
      });
      return restaurantRating;
    },
  },
  Mutation: {
    updateRestaurantRating: async (parent, args, ctx) => {
      const { _id, userId, rating } = args.updateRestaurantRatingInput;
      const restaurant = await RestaurantModel.findById(_id);
      if (!restaurant) {
        throw invalidRestaurantIdError;
      }
      if (restaurant.ratingList.map((rating) => rating.userId).indexOf(userId) !== -1) {
        throw existRestaurantRatingError;
      }
      restaurant.ratingList.push({
        userId,
        rating,
      });
      return await restaurant.save();
    },
  },
};

export default resolvers;
