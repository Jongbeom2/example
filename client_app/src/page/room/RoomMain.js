import {useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {GET_MY_ROOM_LIST} from './room.query';
import {isNotAuthorizedError} from '../../lib/error';
import {MESSAGE_ERROR, MESSAGE_ERROR_AUTH} from '../../res/message';
import {AuthContext} from '../../../App';
import RoomCard from './RoomCard';
import {useTheme} from 'react-native-paper';
import {FAB} from 'react-native-paper';
import RoomSearchDialog from './RoomSearchDialog';
import RoomCreateDialog from './RoomCreateDialog';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  searchBtn: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  createBtn: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
  },
});
const RoomMain = ({navigation, route}) => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const [isOpenRoomCreateDialog, setIsOpenRoomCreateDialog] = useState(false);
  const [isOpenRoomSearchDialog, setIsOpenRoomSearchDialog] = useState(false);
  // 대화방 리스트
  const {data, loading, error, refetch} = useQuery(GET_MY_ROOM_LIST, {
    variables: {
      userId: route.params?.userId,
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
      authContext.signOut();
      Alert.alert(MESSAGE_ERROR_AUTH);
    } else if (error) {
      Alert.alert(MESSAGE_ERROR);
    }
  }, [error, authContext]);
  const onPressSearchBtn = () => {
    setIsOpenRoomSearchDialog(true);
  };
  const onPressCreateBtn = () => {
    setIsOpenRoomCreateDialog(true);
  };
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        {roomList.map(room => (
          <RoomCard
            key={room._id}
            room={room}
            navigation={navigation}
            userId={route.params?.userId}
          />
        ))}
      </ScrollView>
      <FAB
        style={[{backgroundColor: theme.colors.primary}, styles.createBtn]}
        small
        icon="magnify"
        onPress={onPressSearchBtn}
      />
      <FAB
        style={[{backgroundColor: theme.colors.primary}, styles.searchBtn]}
        small
        icon="plus"
        onPress={onPressCreateBtn}
      />
      <RoomCreateDialog
        route={route}
        visible={isOpenRoomCreateDialog}
        refetch={refetch}
        onDismiss={() => {
          setIsOpenRoomCreateDialog(false);
        }}
      />
      <RoomSearchDialog
        route={route}
        visible={isOpenRoomSearchDialog}
        refetch={refetch}
        onDismiss={() => {
          setIsOpenRoomSearchDialog(false);
        }}
      />
    </SafeAreaView>
  );
};
export default RoomMain;
