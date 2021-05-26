import {useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import {GET_MY_ROOM_LIST} from './room.query';
import {isNotAuthorizedError} from '../../lib/error';
import {MESSAGE_ERROR, MESSAGE_ERROR_AUTH} from '../../res/message';
import {AuthContext} from '../../../App';
import RoomCard from './RoomCard';
const RoomMain = ({navigation}) => {
  const {state, dispatch} = useContext(AuthContext);
  const userId = state.userId;
  // 대화방 리스트
  const {data, loading, error, refetch} = useQuery(GET_MY_ROOM_LIST, {
    variables: {
      userId,
    },
  });
  const [roomList, setRoomList] = useState([]);
  // 대화방 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setRoomList(data.getMyRoomList);
    }
  }, [data, error]);
  // 대화방 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      Alert.alert(MESSAGE_ERROR_AUTH);
      dispatch({type: 'SIGN_OUT'});
    } else if (error) {
      Alert.alert(MESSAGE_ERROR);
    }
  }, [error, dispatch]);
  return (
    <ScrollView>
      {roomList.map(room => (
        <RoomCard key={room._id} room={room} navigation={navigation} />
      ))}
    </ScrollView>
  );
};
export default RoomMain;
