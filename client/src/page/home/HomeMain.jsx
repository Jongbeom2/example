import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import MainWrapper from 'src/components/MainWrapper';
import { GET_FRIEND_LIST } from './home.query';
import Cookie from 'js-cookie';
import { MESSAGE_ERROR } from 'src/res/message';
import Loading from 'src/components/Loading';
import UserCard from './UserCard';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
  },
}));
const Home = () => {
  const classes = useStyles();
  const userId = Cookie.get('_id');
  const { data, loading, error } = useQuery(GET_FRIEND_LIST, {
    variables: {
      userId: userId,
    },
  });
  const [userList, setUserList] = useState([]);
  // 유저 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setUserList(data.getFriendList);
    }
  }, [data]);
  // 유저 리스트 로드 실패
  useEffect(() => {
    if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error]);
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        {userList.map((user) => (
          <UserCard user={user} />
        ))}
      </div>
    </MainWrapper>
  );
};

export default Home;
