import React from 'react';
import {Text, View} from 'react-native';
const RestaurantDetail = ({route}) => {
  const restaurantId = route?.params?.restaurantId;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{restaurantId}</Text>
    </View>
  );
};
export default RestaurantDetail;
