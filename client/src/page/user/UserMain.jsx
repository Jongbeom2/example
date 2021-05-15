import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import { useQuery } from '@apollo/client';
import { GET_USER } from './user.query';
import Loading from 'src/components/Loading';
import { MESSAGE_ERROR, MESSAGE_USER_FAIL } from 'src/res/message';
import { Avatar, Button, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import Cookie from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  content: {
    display: 'flex',
    padding: theme.spacing(5),
    '& .MuiAvatar-root': {
      width: '10rem',
      height: '10rem',
    },
  },
  contentText: {
    marginLeft: theme.spacing(5),
  },
  editBtn: {
    marginLeft: theme.spacing(2),
  },
}));
const UserMain = () => {
  const classes = useStyles();
  const history = useHistory();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  // 유저 정보 로드
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: userId },
  });
  // 유저 정보 로드 성공
  useEffect(() => {
    if (data && !error) {
      setUser(data.getUser);
    }
  }, [data]);
  // 유저 정보 로드 실패
  useEffect(() => {
    if (error) {
      if (error.message === 'INVALID_USER_ID') {
        alert(MESSAGE_USER_FAIL);
      } else {
        alert(MESSAGE_ERROR);
      }
    }
  }, [error]);
  const onClickEditBtn = () => {
    history.push(`/user/${userId}/edit`);
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        <div className={classes.content}>
          <Avatar alt='Avatar' src={user?.profileImageURL || ''} />
          <div className={classes.contentText}>
            <Typography variant='h6' gutterBottom>
              {user?.nickname || ''}
              {userId === Cookie.get('_id') && (
                <Button
                  className={classes.editBtn}
                  color='primary'
                  variant='outlined'
                  onClick={onClickEditBtn}
                >
                  수정
                </Button>
              )}
            </Typography>
            <Typography variant='body1' gutterBottom>
              게시물 0
            </Typography>
            <Typography variant='body1'>참여중인 대화방 0</Typography>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};
export default UserMain;
