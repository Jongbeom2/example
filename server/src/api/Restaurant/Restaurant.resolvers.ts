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
};

export default resolvers;
