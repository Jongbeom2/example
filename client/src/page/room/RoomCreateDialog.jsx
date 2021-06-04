import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import Cookie from 'js-cookie';
import { CREATE_ROOM } from './room.query';
import Loading from 'src/components/Loading';
import {
  MESSAGE_ERROR_AUTH,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS_CREATE_ROOM,
} from 'src/res/message';
import { isNotAuthorizedError } from 'src/lib/error';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& .MuiPaper-root': {
      width: '20rem',
    },
  },
}));
const RoomCreateDialog = ({ isOpened = false, onClose = () => {} }) => {
  const classes = useStyles();
  const history = useHistory();
  const userId = Cookie.get('_id');
  const [roomName, setRoomName] = useState('');
  // 대화방 생성
  const [createRoom, { data, loading, error }] = useMutation(CREATE_ROOM);
  // 대화방 생성 성공
  useEffect(() => {
    if (data && !error) {
      alert(MESSAGE_SUCCESS_CREATE_ROOM);
      onCloseDialog();
    }
  }, [data]);
  // 대화방 생성 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error]);
  const onChangeRoomName = (event) => {
    setRoomName(event.target.value);
  };
  const onClickCancelBtn = () => {
    onCloseDialog();
  };
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
  const onCloseDialog = () => {
    setRoomName('');
    onClose();
  };
  return (
    <Dialog className={classes.root} onClose={onCloseDialog} open={isOpened}>
      {loading && <Loading />}
      <DialogTitle>대화방 생성</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id='name'
          label='대화방 이름'
          type='text'
          fullWidth
          onChange={onChangeRoomName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancelBtn} color='primary'>
          취소
        </Button>
        <Button onClick={onClickCreateBtn} color='primary'>
          생성
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default RoomCreateDialog;
