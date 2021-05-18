import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import { useQuery } from '@apollo/client';
import { GET_MY_ROOM_LIST } from './room.query';
import Loading from 'src/components/Loading';
import RoomCard from './RoomCard';
import Cookie from 'js-cookie';
import { MESSAGE_ERROR_AUTH, MESSAGE_ERROR } from 'src/res/message';
import { Button, Typography } from '@material-ui/core';
import RoomCreateDialog from './RoomCreateDialog';
import RoomSearchDialog from './RoomSearchDialog';
import { isNotAuthorizedError } from 'src/lib/error';
import { useHistory } from 'react-router';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
  },
  header: {
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiTypography-root': {
      marginLeft: theme.spacing(2),
    },
    '& .MuiButtonBase-root': {
      marginRight: theme.spacing(2),
    },
  },
}));
const RoomMain = () => {
  const classes = useStyles();
  const history = useHistory();
  const userId = Cookie.get('_id');
  const [isOpenRoomCreateDialog, setIsOpenRoomCreateDialog] = useState(false);
  const [isOpenRoomSearchDialog, setIsOpenRoomSearchDialog] = useState(false);
  // 대화방 리스트
  const { data, loading, error, refetch } = useQuery(GET_MY_ROOM_LIST, {
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
  }, [data]);
  // 대화방 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error]);
  const onClickRoomCreateBtn = () => {
    setIsOpenRoomCreateDialog(true);
  };
  const onClickRoomSearchBtn = () => {
    setIsOpenRoomSearchDialog(true);
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        <div className={classes.header}>
          <Typography variant='h6'>참여중인 대화방</Typography>
          <div>
            <Button
              color='primary'
              variant='outlined'
              onClick={onClickRoomSearchBtn}
            >
              대화방 검색
            </Button>
            <Button
              color='primary'
              variant='outlined'
              onClick={onClickRoomCreateBtn}
            >
              대화방 생성
            </Button>
          </div>
        </div>
        <div className={classes.body}>
          {roomList.map((room) => (
            <RoomCard room={room} />
          ))}
        </div>
      </div>
      <RoomCreateDialog
        isOpened={isOpenRoomCreateDialog}
        onClose={() => {
          refetch();
          setIsOpenRoomCreateDialog(false);
        }}
      />
      <RoomSearchDialog
        isOpened={isOpenRoomSearchDialog}
        onClose={() => {
          refetch();
          setIsOpenRoomSearchDialog(false);
        }}
      />
    </MainWrapper>
  );
};
export default RoomMain;
