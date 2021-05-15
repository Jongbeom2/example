import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import { useQuery } from '@apollo/client';
import { GET_ROOM_LIST } from './room.query';
import Loading from 'src/components/Loading';
import RoomCard from './RoomCard';
import Cookie from 'js-cookie';
import { MESSAGE_ERROR } from 'src/res/message';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
  },
}));
const RoomMain = () => {
  const classes = useStyles();
  const userId = Cookie.get('_id');
  // 대화방 리스트
  const { data, loading, error } = useQuery(GET_ROOM_LIST, {
    variables: {
      userId,
    },
  });
  const [roomList, setRoomList] = useState([]);
  // 대화방 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setRoomList(data.getRoomList);
    }
  }, [data]);
  // 대화방 리스트 로드 실패
  useEffect(() => {
    if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error]);
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        {roomList.map((room) => (
          <RoomCard room={room} />
        ))}
      </div>
    </MainWrapper>
  );
};
export default RoomMain;
