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
