import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import { useQuery } from '@apollo/client';
import { GET_USER } from './user.query';
import Loading from 'src/components/Loading';
import { MESSAGE_ERROR, MESSAGE_ERROR_AUTH } from 'src/res/message';
import { Avatar, Button, Fab, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import Cookie from 'js-cookie';
import { isNotAuthorizedError } from 'src/lib/error';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import invalidImage from 'src/res/img/invalid_image.png';
import { useImage } from 'react-image';
import { Suspense } from 'react';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  btnWrapper: {
    width: 'fit-content',
    top: 0,
    position: 'absolute',
    display: 'flex',
    zIndex: theme.zIndex.fixedBtn,
    justifyContent: 'space-between',
    '& button': {
      margin: theme.spacing(2),
    },
  },
  content: {
    display: 'flex',
    padding: theme.spacing(5),
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
    variables: { _id: userId },
    fetchPolicy: 'cache-first',
  });
  // 유저 정보 로드 성공
  useEffect(() => {
    if (data && !error) {
      setUser(data.getUser);
    }
  }, [data, error]);
  // 유저 정보 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error, history]);
  const onClickEditBtn = () => {
    history.push(`/user/${userId}/edit`);
  };
  const onClickBackBtn = () => {
    history.goBack();
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        <div className={classes.btnWrapper}>
          <Fab color='primary' size='small' onClick={onClickBackBtn}>
            <ArrowBackIcon fontSize='small' />
          </Fab>
        </div>
        <div className={classes.content}>
          <Suspense fallback={null}>
            <ImageComponent imageURL={user?.profileImageURL} />
          </Suspense>
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
const useStyles1 = makeStyles((theme) => ({
  root: {
    width: '10rem',
    height: '10rem',
    borderRadius: '50%',
  },
}));
const ImageComponent = ({ imageURL, ...rest }) => {
  const classes = useStyles1();
  const { src } = useImage({
    srcList: [
      process.env.REACT_APP_STORAGE_RESIZED_URL + imageURL,
      process.env.REACT_APP_STORAGE_URL + imageURL,
      invalidImage,
    ],
  });
  return <img alt='user' {...rest} src={src} className={classes.root} />;
};
export default UserMain;
