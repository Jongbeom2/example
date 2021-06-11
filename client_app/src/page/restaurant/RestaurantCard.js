import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 5,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textWrapper: {},
});
const RestaurantCard = ({restaurant, navigation, userId}) => {
  const onPress = () => {
    navigation.navigate('restaurantdetail', {
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      userId,
    });
  };
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Image style={styles.image} source={{uri: restaurant.profileImageURL}} />
      <View style={styles.textWrapper}>
        <Text>{restaurant.name}</Text>
        <Text>⭐ {restaurant.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default RestaurantCard;
