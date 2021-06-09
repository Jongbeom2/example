import {useLazyQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_TITLE,
} from 'src/res/message';
import {GET_RESTAURANT_LIST} from './restaurant.query';
import pinBlack from 'src/res/img/pin_black.png';
import pinBlue from 'src/res/img/pin_blue.png';
import pinRed from 'src/res/img/pin_red.png';
import pinYellow from 'src/res/img/pin_yellow.png';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});
const RestaurantMain = () => {
  const authContext = useContext(AuthContext);
  const [zoom, setZoom] = useState(17);
  const [restaurantList, setRestaurantList] = useState([]);
  const [activeRestaurantList, setActiveRestaurantList] = useState([]);
  // 식당 리스트
  const [getRestaurantList, {data, loading, error}] =
    useLazyQuery(GET_RESTAURANT_LIST);
  // 식당 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setRestaurantList(data.getRestaurantList);
    }
  }, [data, error]);
  // 식당 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  // useEffect(() => {
  //   getRestaurantList({
  //     variables: {
  //       // minLat: bounds._min._lat,
  //       // maxLat: bounds._max._lat,
  //       // minLng: bounds._min._lng,
  //       // maxLng: bounds._max._lng,
  //     },
  //   });
  // }, [getRestaurantList]);
  const onCameraChange = e => {
    getRestaurantList({
      variables: {
        minLat: e.contentRegion[0].latitude,
        maxLat: e.contentRegion[1].latitude,
        minLng: e.contentRegion[0].longitude,
        maxLng: e.contentRegion[2].longitude,
      },
    });
    setZoom(e.zoom);
  };
  // if (!data && loading) {
  //   return <Loading />;
  // }
  return (
    <NaverMapView
      style={styles.root}
      showsMyLocationButton={true}
      center={{
        latitude: 37.35023,
        longitude: 127.10892,
        zoom: 17,
      }}
      onCameraChange={onCameraChange}>
      {restaurantList.map(restaurant => (
        <Marker
          key={restaurant._id}
          coordinate={{latitude: restaurant.lat, longitude: restaurant.lng}}
          image={getImage(restaurant.rating)}
          width={30}
          height={30}
          onClick={e => {
            console.log(e);
            const overlapedRestaurantList = [];
            restaurantList.forEach(targetRestaurant => {
              if (
                restaurant !== targetRestaurant &&
                isOverlaped(restaurant, targetRestaurant, zoom)
              ) {
                overlapedRestaurantList.push(targetRestaurant);
              }
            });
            console.log(overlapedRestaurantList);
          }}
        />
      ))}
    </NaverMapView>
  );
};

const getImage = rating => {
  if (rating < 1.25) {
    return pinBlack;
  } else if (rating < 2.5) {
    return pinBlue;
  } else if (rating < 3.75) {
    return pinYellow;
  } else {
    return pinRed;
  }
};

const isOverlaped = (restaurant, targetRestaurant, zoom) => {
  const len = Math.sqrt(
    Math.pow(restaurant.lat - targetRestaurant.lat, 2) +
      Math.pow(restaurant.lng - targetRestaurant.lng, 2),
  );
  console.log(len);
  console.log(zoom);
  return len < ((0.0005 * 14) / zoom) * 2;
};
export default RestaurantMain;
