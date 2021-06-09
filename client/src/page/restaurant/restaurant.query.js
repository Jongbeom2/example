import { gql } from '@apollo/client';

export const GET_RESTAURANT_LIST = gql`
  query getRestaurantList(
    $minLat: Float!
    $maxLat: Float!
    $minLng: Float!
    $maxLng: Float!
  ) {
    getRestaurantList(
      minLat: $minLat
      maxLat: $maxLat
      minLng: $minLng
      maxLng: $maxLng
    ) {
      _id
      name
      lat
      lng
      profileImageURL
      imageURLList
      rating
      ratingList {
        userId
        rating
      }
    }
  }
`;

export const GET_RESTAURANT = gql`
  query getRestaurant($_id: ID!) {
    getRestaurant(_id: $_id) {
      _id
      name
      lat
      lng
      profileImageURL
      imageURLList
      rating
      ratingList {
        userId
        rating
      }
    }
  }
`;

export const UPDATE_RESTAURANT_RATING = gql`
  mutation updateRestaurantRating(
    $updateRestaurantRatingInput: UpdateRestaurantRatingInput!
  ) {
    updateRestaurantRating(
      updateRestaurantRatingInput: $updateRestaurantRatingInput
    ) {
      _id
      name
      lat
      lng
      profileImageURL
      imageURLList
      rating
      ratingList {
        userId
        rating
      }
    }
  }
`;
