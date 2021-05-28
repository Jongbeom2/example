import {useMutation, useQuery} from '@apollo/client';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, RadioButton, Portal} from 'react-native-paper';
import {isNotAuthorizedError} from '../../lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_SUCCESS_UPDATE_USER_ADD_ROOM,
  MESSAGE_TITLE,
} from '../../res/message';
import {GET_ROOM_LIST, UPDATE_USER_ADD_ROOM} from './room.query';
const styles = StyleSheet.create({
  root: {},
  content: {
    height: 400,
  },
  btn: {
    margin: 10,
  },
});
const RoomSearchDialog = ({visible, onDismiss, route, refetch}) => {
  const [roomList, setRoomList] = useState([]);
  const [value, setValue] = useState(null);
  // 대화방 로드
  const {data, loading, error} = useQuery(GET_ROOM_LIST, {
    variables: {
      userId: route.params?.userId,
    },
  });
  // 대화방 로드 성공
  useEffect(() => {
    if (data && !error) {
      setRoomList(data.getRoomList);
    }
  }, [data, error]);
  // 대화방 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      Alert.alert(MESSAGE_ERROR_AUTH);
    } else if (error) {
      Alert.alert(MESSAGE_ERROR);
    }
  }, [error]);
  // 대화방 참여
  const [
    updateUserAddRoom,
    {data: mutationData, loading: mutationLoading, error: mutationError},
  ] = useMutation(UPDATE_USER_ADD_ROOM);
  // 대화방 참여 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_UPDATE_USER_ADD_ROOM);
      refetch();
      closeDialog();
    }
  }, [mutationData, mutationError, closeDialog, refetch]);
  // 대화방 참여 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      Alert.alert(MESSAGE_ERROR_AUTH);
    } else if (mutationError) {
      Alert.alert(MESSAGE_ERROR);
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
          userId: route.params?.userId,
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
      </Dialog>
    </Portal>
  );
};
export default RoomSearchDialog;
