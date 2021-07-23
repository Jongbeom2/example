"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorObject_1 = require("../../error/ErrorObject");
const Restaurant_model_1 = __importDefault(require("../../models/Restaurant.model"));
const resolvers = {
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
            const restaurantList = await Restaurant_model_1.default.find()
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
            const restaurant = await Restaurant_model_1.default.findById(_id);
            if (!restaurant) {
                throw ErrorObject_1.invalidRestaurantIdError;
            }
            return restaurant;
        },
    },
    Restaurant: {
        rating: async (parent, args, ctx) => {
            let restaurantRating = 0;
            parent.ratingList.forEach((rating) => {
                restaurantRating += rating.rating / parent.ratingList.length;
            });
            return parseFloat(restaurantRating.toFixed(1));
        },
    },
    Mutation: {
        updateRestaurantRating: async (parent, args, ctx) => {
            const { _id, userId, rating } = args.updateRestaurantRatingInput;
            const restaurant = await Restaurant_model_1.default.findById(_id);
            if (!restaurant) {
                throw ErrorObject_1.invalidRestaurantIdError;
            }
            if (restaurant.ratingList.map((rating) => rating.userId).indexOf(userId) !== -1) {
                throw ErrorObject_1.existRestaurantRatingError;
            }
            restaurant.ratingList.push({
                userId,
                rating,
            });
            return await restaurant.save();
        },
    },
};
exports.default = resolvers;
