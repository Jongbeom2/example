import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, RadioButton, Portal} from 'react-native-paper';
import {AuthContext} from 'src/Main';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_SUCCESS_UPDATE_USER_ADD_ROOM,
  MESSAGE_TITLE,
} from 'src/res/message';
import {
  GET_MY_ROOM_LIST,
  GET_ROOM_LIST,
  UPDATE_USER_ADD_ROOM,
} from 'src/page/room/room.query';
const styles = StyleSheet.create({
  root: {},
  content: {
    height: 400,
  },
  btn: {
    margin: 10,
  },
});
const RoomSearchDialog = ({visible, onDismiss, route}) => {
  useEffect(() => {
    if (visible) {
      getRoomList({
        variables: {
          userId,
        },
      });
    }
  }, [visible, userId, getRoomList]);
  const authContext = useContext(AuthContext);
  const [roomList, setRoomList] = useState([]);
  const [value, setValue] = useState(null);
  const userId = route.params?.userId;
  // 대화방 로드
  const [getRoomList, {data, loading, error}] = useLazyQuery(GET_ROOM_LIST);
  // 대화방 로드 성공
  useEffect(() => {
    if (data && !error) {
      setRoomList(data.getRoomList);
    }
  }, [data, error]);
  // 대화방 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
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
      }).getMyRoomList;
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
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_UPDATE_USER_ADD_ROOM);
      closeDialog();
    }
  }, [mutationData, mutationError, closeDialog]);
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
  const onClickEnterBtn = () => {
    if (!value) {
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
  const closeDialog = useCallback(() => {
    onDismiss();
    setValue(null);
  }, [onDismiss]);

  return (
    <Portal style={styles.root}>
      <Dialog visible={visible} onDismiss={closeDialog}>
        {loading || mutationLoading ? (
          <>
            <Dialog.Title>{MESSAGE_TITLE}</Dialog.Title>
            <Dialog.Content style={styles.content}>
              <Loading />
            </Dialog.Content>
          </>
        ) : (
          <>
            <Dialog.Title>{MESSAGE_TITLE}</Dialog.Title>
            <Dialog.Content style={styles.content}>
              <ScrollView>
                <RadioButton.Group onValueChange={onChangeValue} value={value}>
                  {roomList.map(room => (
                    <RadioButton.Item
                      key={room._id}
                      label={room.name}
                      value={room._id}
                    />
                  ))}
                </RadioButton.Group>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button style={styles.btn} onPress={closeDialog}>
                취소
              </Button>
              <Button style={styles.btn} onPress={onClickEnterBtn}>
                확인
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
};
export default RoomSearchDialog;
