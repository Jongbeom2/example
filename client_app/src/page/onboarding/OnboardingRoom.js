import {useMutation} from '@apollo/client';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import {Text, useTheme, RadioButton, Button, Divider} from 'react-native-paper';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_INPUT_ALL_REQUIRED,
  MESSAGE_TITLE,
} from 'src/res/message';
import {GET_MY_ROOM_LIST, UPDATE_USER_ADD_ROOM} from '../room/room.query';
const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 20,
  },
  roomList: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  btn: {
    width: 300,
  },
});
const OnboardingRoom = ({userId, roomList}) => {
  const authContext = useContext(AuthContext);
  const {colors} = useTheme();
  const [value, setValue] = useState(null);
  // 애니메이션
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  // 대화방 참여
  const [
    updateUserAddRoom,
    {data: mutationData, loading: mutationLoading, error: mutationError},
  ] = useMutation(UPDATE_USER_ADD_ROOM, {
    update(cache, {data: mutationDataResult}) {
      const newRoom = mutationDataResult.updateUserAddRoom;
      const existingRoomList = cache.readQuery({
        query: GET_MY_ROOM_LIST,
        variables: {
          userId,
        },
      })?.getMyRoomList;
      if (newRoom && existingRoomList) {
        cache.writeQuery({
          query: GET_MY_ROOM_LIST,
          variables: {
            userId,
          },
          data: {
            getMyRoomList: [...existingRoomList, newRoom],
          },
        });
      }
    },
  });
  // 대화방 참여 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      authContext.visit();
    }
  }, [mutationData, mutationError, authContext]);
  // 대화방 참여 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError]);
  const onChangeValue = v => {
    setValue(v);
  };
  const onPress = () => {
    if (value === null) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_INPUT_ALL_REQUIRED);
      return;
    }
    updateUserAddRoom({
      variables: {
        updateUserAddRoomInput: {
          userId,
          roomId: value,
        },
      },
    });
  };
  if (mutationLoading) {
    return <Loading />;
  }
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}>
      <KeyboardAvoidingView
        style={[styles.root, {backgroundColor: colors.custom.white}]}>
        <Text style={styles.title}>마지막으로 대화방을 선택해주세요!</Text>
        <View
          style={[styles.roomList, {backgroundColor: colors.custom.greyLight}]}>
          <ScrollView>
            <RadioButton.Group onValueChange={onChangeValue} value={value}>
              {roomList.map(room => (
                <View key={room._id}>
                  <RadioButton.Item
                    style={styles.room}
                    label={room.name}
                    value={room._id}
                  />
                  <Divider style={{backgroundColor: colors.primaryDrak}} />
                </View>
              ))}
            </RadioButton.Group>
          </ScrollView>
        </View>
        <Button style={styles.btn} mode="contained" onPress={onPress}>
          시작하기
        </Button>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
export default OnboardingRoom;
