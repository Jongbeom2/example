import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import MainWrapper from 'src/components/MainWrapper';
import { GET_USER_LIST } from './home.query';
import Cookie from 'js-cookie';
import { MESSAGE_ERROR, MESSAGE_ERROR_AUTH } from 'src/res/message';
import Loading from 'src/components/Loading';
import UserCard from './UserCard';
import { makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
import { isNotAuthorizedError } from 'src/lib/error';
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
  },
}));
const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const userId = Cookie.get('_id');
  const { data, loading, error } = useQuery(GET_USER_LIST, {
    variables: {
      _id: userId,
    },
  });
  const [userList, setUserList] = useState([]);
  // 유저 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setUserList(data.getUserList);
    }
  }, [data, error]);
  // 유저 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error, history]);
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        <div className={classes.header}>
          <Typography variant='h6'>유저</Typography>
        </div>
        <div className={classes.body}>
          {userList.map((user) => (
            <UserCard user={user} />
          ))}
        </div>
      </div>
    </MainWrapper>
  );
};

export default Home;
