import {useLazyQuery} from '@apollo/client';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {MESSAGE_ERROR, MESSAGE_TITLE} from 'src/res/message';
import {GET_RESTAURANT_LIST} from './restaurant.query';
import pinBlack from 'src/res/img/pin_black.png';
import pinBlue from 'src/res/img/pin_blue.png';
import pinRed from 'src/res/img/pin_red.png';
import pinYellow from 'src/res/img/pin_yellow.png';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {useTheme} from 'react-native-paper';
import RestaurantCard from './RestaurantCard';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    paddingTop: 5,
    paddingHorizontal: 5,
  },
});
const RestaurantMain = ({navigation, route}) => {
  const theme = useTheme();
  const userId = route.params?.userId;
  const authContext = useContext(AuthContext);
  const sheetRef = useRef(null);
  const [zoom, setZoom] = useState(17);
  const [restaurantList, setRestaurantList] = useState([]);
  const [activeRestaurantList, setActiveRestaurantList] = useState([]);
  const [snapPoints, setSnapPoints] = useState(0);
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
  const onCameraChange = e => {
    const {minLat, maxLat, minLng, maxLng} = getBoundFromContentRegion(
      e.contentRegion,
    );
    getRestaurantList({
      variables: {
        minLat,
        maxLat,
        minLng,
        maxLng,
      },
    });
    setZoom(e.zoom);
    console.log(e);
  };
  const bottomSheetRenderContent = () => {
    return (
      <View
        style={[
          {backgroundColor: theme.colors.custom.white},
          styles.bottomSheet,
        ]}>
        {activeRestaurantList.map(restaurant => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            navigation={navigation}
            userId={userId}
          />
        ))}
      </View>
    );
  };
  // if (!data && loading) {
  //   return <Loading />;
  // }
  return (
    <View>
      <NaverMapView
        style={styles.root}
        showsMyLocationButton={true}
        center={{
          latitude: 37.35023,
          longitude: 127.10892,
          zoom: 17,
        }}
        useTextureView
        onCameraChange={onCameraChange}>
        {restaurantList.map(restaurant => (
          <Marker
            key={restaurant._id}
            coordinate={{latitude: restaurant.lat, longitude: restaurant.lng}}
            image={getImage(restaurant.rating)}
            width={30}
            height={30}
            onClick={e => {
              const overlapedRestaurantList = [];
              restaurantList.forEach(targetRestaurant => {
                if (
                  restaurant !== targetRestaurant &&
                  isOverlaped(restaurant, targetRestaurant, zoom)
                ) {
                  overlapedRestaurantList.push(targetRestaurant);
                }
              });
              setActiveRestaurantList([restaurant, ...overlapedRestaurantList]);
              setSnapPoints(
                (overlapedRestaurantList.length + 1 > 4
                  ? 4
                  : overlapedRestaurantList.length + 1) *
                  55 +
                  3,
              );
              sheetRef.current.snapTo(0);
            }}
          />
        ))}
      </NaverMapView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[snapPoints, 0]}
        initialSnap={1}
        borderRadius={10}
        renderContent={bottomSheetRenderContent}
        enabledInnerScrolling
      />
    </View>
  );
};

const getBoundFromContentRegion = contentRegion => {
  let minLat = 999999;
  let maxLat = -999999;
  let minLng = 99999;
  let maxLng = -999999;
  contentRegion.forEach(ele => {
    if (minLat > ele.latitude) {
      minLat = ele.latitude;
    }
    if (maxLat < ele.latitude) {
      maxLat = ele.latitude;
    }
    if (minLng > ele.longitude) {
      minLng = ele.longitude;
    }
    if (maxLng < ele.longitude) {
      maxLng = ele.longitude;
    }
  });
  return {minLat, maxLat, minLng, maxLng};
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
  return len < ((0.0005 * 14) / zoom) * 2;
};

export default RestaurantMain;
