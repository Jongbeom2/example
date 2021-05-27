import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import Cookie from 'js-cookie';
import { GET_ROOM_LIST, UPDATE_USER_ADD_ROOM } from './room.query';
import Loading from 'src/components/Loading';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_SUCCESS_UPDATE_USER_ADD_ROOM,
} from 'src/res/message';
import { isNotAuthorizedError } from 'src/lib/error';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& .MuiPaper-root': {
      width: '20rem',
    },
    '& .MuiDialogContent-root': {
      height: '15rem',
    },
  },
}));
const RoomSearchDialog = ({
  isOpened = false,
  refetch,
  onClose = () => {},
}) => {
  const classes = useStyles();
  const history = useHistory();
  const userId = Cookie.get('_id');
  const [value, setValue] = useState(null);
  const [roomList, setRoomList] = useState([]);
  // 대화방 로드
  const { data, loading, error } = useQuery(GET_ROOM_LIST, {
    variables: {
      userId,
    },
  });
  // 대화방 로드 성공
  useEffect(() => {
    if (data && !error) {
      setRoomList(data.getRoomList);
    }
  }, [data]);
  // 대화방 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error]);
  // 대화방 참여
  const [
    updateUserAddRoom,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_USER_ADD_ROOM);
  // 대화방 참여 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      alert(MESSAGE_SUCCESS_UPDATE_USER_ADD_ROOM);
      refetch();
      closeDialog();
    }
  }, [mutationData]);
  // 대화방 참여 실패
  useEffect(() => {
    if (mutationError) {
      alert(MESSAGE_ERROR);
    }
  }, [mutationError]);
  const onClickCancelBtn = () => {
    closeDialog();
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
  const onChangeValue = (event) => {
    setValue(event.target.value);
  };
  const closeDialog = () => {
    onClose();
    setValue(null);
  };
  return (
    <Dialog className={classes.root} onClose={closeDialog} open={isOpened}>
      {loading && <Loading />}
      <DialogTitle>대화방 검색</DialogTitle>
      <DialogContent dividers>
        <RadioGroup value={value} onChange={onChangeValue}>
          {roomList.map((room) => (
            <FormControlLabel
              value={room._id}
              key={room._id}
              control={<Radio />}
              label={room.name}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancelBtn} color='primary'>
          취소
        </Button>
        <Button onClick={onClickEnterBtn} color='primary'>
          참여
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default RoomSearchDialog;
