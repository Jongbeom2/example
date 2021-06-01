import {useMutation} from '@apollo/client';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Button, Dialog, TextInput, Portal} from 'react-native-paper';
import {AuthContext} from '../../../App';
import Loading from '../../component/Loading';
import {isNotAuthorizedError} from '../../lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_SUCCESS_CREATE_ROOM,
  MESSAGE_TITLE,
} from '../../res/message';
import {CREATE_ROOM} from './room.query';
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
const RoomCreateDialog = ({
  visible,
  onDismiss,
  route,
  refetch: parentRefetch,
}) => {
  const authContext = useContext(AuthContext);
  const [roomName, setRoomName] = useState('');
  // 대화방 생성
  const [createRoom, {data, loading, error}] = useMutation(CREATE_ROOM);
  // 대화방 생성 성공
  useEffect(() => {
    if (data && !error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_CREATE_ROOM);
      parentRefetch();
      closeDialog();
    }
  }, [data, error, closeDialog, parentRefetch]);
  // 대화방 생성 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_AUTH);
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  const onClickCreateBtn = () => {
    createRoom({
      variables: {
        createRoomInput: {
          userId: route.params?.userId,
          name: roomName,
        },
      },
    });
  };
  const closeDialog = useCallback(() => {
    onDismiss();
  }, [onDismiss]);
  const onChangeRoomName = text => {
    setRoomName(text);
  };
  return (
    <Portal style={styles.root}>
      <Dialog visible={visible} onDismiss={closeDialog}>
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
