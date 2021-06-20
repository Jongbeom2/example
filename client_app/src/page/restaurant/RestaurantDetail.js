import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useContext, useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { isNotAuthorizedError } from 'src/lib/error';
import { AuthContext } from 'src/Main';
import {
  MESSAGE_ERROR,
  MESSAGE_TITLE,
  MESSAGE_SUCCESS_UPDATE_RESTAURANT_RATING,
  MESSAGE_ERROR_UPDATE_RESTAURANT_RATING_EXIST_RATING,
  MESSAGE_ERROR_PDATE_RESTAURANT_RATING_INPUT_REQUIRED,
} from 'src/res/message';
import { GET_RESTAURANT, UPDATE_RESTAURANT_RATING } from './restaurant.query';
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import Loading from 'src/component/Loading';
import { AirbnbRating } from 'react-native-ratings';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  carouselWrapper: {
    width: '100%',
    height: '30%',
  },
  surface: {
    position: 'absolute',
    width: '80%',
    height: 270,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 4,
    padding: 10,
    borderRadius: 5,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  btn: {
    marginTop: 10,
  },
});
const RestaurantDetail = ({ route }) => {
  const userId = route.params?.userId;
  const restaurantId = route?.params?.restaurantId;
  const authContext = useContext(AuthContext);
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  // 식당 정보 로드
  const { data, loading, error } = useQuery(GET_RESTAURANT, {
    variables: { _id: restaurantId },
    fetchPolicy: 'cache-first',
  });
  // 식당 정보 로드 성공
  useEffect(() => {
    if (data && !error) {
      setRestaurant(data.getRestaurant);
    }
  }, [data, error]);
  // 식당 정보 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  // 식당 평점 수정
  const [
    updateRestaurantRating,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_RESTAURANT_RATING);
  // 식당 평점 수정 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_UPDATE_RESTAURANT_RATING);
    }
  }, [mutationData, mutationError]);
  // 식당 평점 수정 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      authContext.signOut();
    } else if (mutationError?.message === 'EXIST_RESTAURANT_RATING') {
      Alert.alert(
        MESSAGE_TITLE,
        MESSAGE_ERROR_UPDATE_RESTAURANT_RATING_EXIST_RATING,
      );
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError, authContext]);
  const onFinishRating = value => {
    setRating(value);
  };
  const onPressBtn = () => {
    if (!rating) {
      Alert.alert(
        MESSAGE_TITLE,
        MESSAGE_ERROR_PDATE_RESTAURANT_RATING_INPUT_REQUIRED,
      );
      return;
    }
    updateRestaurantRating({
      variables: {
        updateRestaurantRatingInput: {
          _id: restaurantId,
          userId,
          rating,
        },
      },
    });
  };
  const renderItem = ({ item, index }) => {
    return <Image style={styles.image} source={{ uri: item }} />;
  };
  if (!data && loading) {
    return <Loading />;
  }
  if (!mutationData && mutationLoading) {
    return <Loading />;
  }
  return (
    <View style={styles.root}>
      <View style={styles.carouselWrapper}>
        <Carousel
          data={restaurant?.imageURLList || []}
          renderItem={renderItem}
          sliderWidth={windowWidth}
          itemWidth={windowWidth}
        />
      </View>
      <Surface style={[styles.surface, { top: windowHeight * 0.3 - 40 }]}>
        <Text style={styles.titleText}>{restaurant?.name}</Text>
        <Text>⭐ {restaurant?.rating}</Text>
        <Text>최근 리뷰 153</Text>
        <Text>최근 사장님댓글 5</Text>
        <AirbnbRating
          defaultRating={0}
          size={20}
          ratingCount={5}
          reviews={[
            '비추에요 🤐',
            '그냥 그래요 🤨',
            '먹을만해요 🙂',
            '맛있어요 😚',
            '완전 강추에요! 🤩',
          ]}
          onFinishRating={onFinishRating}
        />
        <Button mode="outlined" onPress={onPressBtn} style={styles.btn}>
          평점 남기기
        </Button>
      </Surface>
    </View>
  );
};
export default RestaurantDetail;
