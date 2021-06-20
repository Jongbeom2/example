import { useMutation } from '@apollo/client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { Button, Dialog, TextInput, Portal } from 'react-native-paper';
import { AuthContext } from 'src/Main';
import Loading from 'src/component/Loading';
import { isNotAuthorizedError } from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_SUCCESS_CREATE_ROOM,
  MESSAGE_TITLE,
} from 'src/res/message';
import { CREATE_ROOM, GET_MY_ROOM_LIST } from 'src/page/room/room.query';
const styles = StyleSheet.create({
  root: {},
  content: {},
  textInput: {
    height: 50,
  },
  btn: {
    margin: 10,
  },
});
const RoomCreateDialog = ({ visible, onDismiss, route }) => {
  const userId = route.params?.userId;
  const authContext = useContext(AuthContext);
  const [roomName, setRoomName] = useState('');
  const [bottom, setBottom] = useState(0);
  // 대화방 생성
  const [createRoom, { data, loading, error }] = useMutation(CREATE_ROOM, {
    update(cache, { data: mutationDataResult }) {
      const newRoom = mutationDataResult.createRoom;
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
  // 대화방 생성 성공
  useEffect(() => {
    if (data && !error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_CREATE_ROOM);
      closeDialog();
    }
  }, [data, error, closeDialog]);
  // 대화방 생성 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  const onClickCreateBtn = () => {
    if (!roomName) {
      return;
    }
    createRoom({
      variables: {
        createRoomInput: {
          userId,
          name: roomName,
        },
      },
    });
  };
  const closeDialog = useCallback(() => {
    onDismiss();
    setRoomName('');
  }, [onDismiss]);
  const onChangeRoomName = text => {
    setRoomName(text);
  };
  // 키보드 위치 옮기기
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillChangeFrame', onKeyboardChange);
      return () => {
        Keyboard.removeAllListeners();
      }
    }
  }, []);
  const onKeyboardChange = (e) => {
    if (e.endCoordinates.screenY < e.startCoordinates.screenY) {
      setBottom(e.endCoordinates.height * 0.3);
    }
    else {
      setBottom(0)
    }
  };
  return (
    <Portal style={styles.root}>
      <Dialog visible={visible} onDismiss={closeDialog} style={{ bottom: bottom }}>
        {loading ? (
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
              <TextInput
                style={styles.textInput}
                placeholder="이름"
                onChangeText={onChangeRoomName}
                autoFocus
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button style={styles.btn} onPress={closeDialog}>
                취소
              </Button>
              <Button style={styles.btn} onPress={onClickCreateBtn}>
                확인
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
};
export default RoomCreateDialog;
