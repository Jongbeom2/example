import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_USER, UPDATE_USER } from './user.query';
import { useHistory, useParams } from 'react-router';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_ERROR_UPLOAD,
  MESSAGE_SUCCESS_UPDATE_USER,
} from 'src/res/message';
import Loading from 'src/components/Loading';
import MainWrapper from 'src/components/MainWrapper';
import { Avatar, Button, Grid, TextField, Typography } from '@material-ui/core';
import { GET_PRESIGNED_PUT_URL } from 'src/lib/file.query';
import axios from 'axios';
import { isNotAuthorizedError } from 'src/lib/error';
import invalidImage from 'src/res/img/invalid_image.png';
import { useImage } from 'react-image';
import { Suspense } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: theme.spacing(5),
    width: '100%',
  },
  contentTitle: {
    display: 'flex',
    '& .MuiTypography-root': {
      marginRight: theme.spacing(3),
    },
    '& .MuiButtonBase-root': {
      marginRight: theme.spacing(1),
    },
  },
  profileWrapper: {
    position: 'relative',
    width: 'fit-content',
    '& .MuiAvatar-root': {
      width: '10rem',
      height: '10rem',
    },
    '& img': {
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
    },
    '& .MuiButtonBase-root': {
      position: 'absolute',
      height: '1.5rem',
      top: 0,
      left: 'calc(100% - 3rem)',
    },
    '& input': {
      display: 'none',
    },
  },
  defaultProfile: {
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.custom.grey,
    },
  },
}));
const UserEdit = () => {
  const classes = useStyles();
  const history = useHistory();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // 유저 정보 로드
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_USER, {
    variables: { _id: userId },
    fetchPolicy: 'cache-first',
  });
  // 유저 정보 로드 성공
  useEffect(() => {
    if (queryData && !queryError) {
      setUser(queryData.getUser);
    }
  }, [queryData, queryError]);
  // 유저 정보 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(queryError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (queryError) {
      alert(MESSAGE_ERROR);
    }
  }, [queryError, history]);
  // presigned url 로드
  const [
    getPresignedPutURL,
    { data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError },
  ] = useLazyQuery(GET_PRESIGNED_PUT_URL);
  // presigned url 로드 성공
  useEffect(() => {
    if (lazyQueryData && !lazyQueryError) {
      const presignedURL = lazyQueryData.getPresignedPutURL.presignedURL;
      (async function () {
        try {
          // Presigned put url을 이용하여 업로드
          const result = await axios.put(presignedURL, imageFile);
          const url = result.config.url
            .split('?')[0]
            .replace(process.env.REACT_APP_STORAGE_URL, '');
          setUser({
            ...user,
            profileImageURL: url,
          });
        } catch (error) {
          console.log(error);
          alert(MESSAGE_ERROR_UPLOAD);
        }
        setIsLoading(false);
      })();
    }
  }, [lazyQueryData, lazyQueryError, imageFile, user]);
  // presigned url 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (lazyQueryError) {
      alert(MESSAGE_ERROR);
    }
  }, [lazyQueryError, history]);
  // 유저 정보 업데이트
  const [
    updateUser,
    { data: mutationData, loading: mutaionLoading, error: mutationError },
  ] = useMutation(UPDATE_USER);
  // 유저 정보 수정 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      alert(MESSAGE_SUCCESS_UPDATE_USER);
      history.push(`/user/${userId}`);
    }
  }, [mutationData, mutationError, history, userId]);
  // 유저 정보 수정 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (mutationError) {
      alert(MESSAGE_ERROR);
    }
  }, [mutationError, history]);
  const onClickCancelBtn = () => {
    history.push(`/user/${userId}`);
  };
  const onClickSaveBtn = () => {
    updateUser({
      variables: {
        updateUserInput: {
          _id: user._id,
          nickname: user.nickname,
          profileImageURL: user.profileImageURL,
        },
      },
      update(cache, { data: { updateUser } }) {
        cache.writeQuery({
          query: UPDATE_USER,
          variables: {
            updateUserInput: {
              _id: user._id,
              nickname: user.nickname,
              profileImageURL: user.profileImageURL,
            },
          },
          data: {
            user: updateUser,
          },
        });
      },
    });
  };
  const onClickDeleteBtn = () => {
    setUser({ ...user, profileImageURL: undefined });
  };
  const onChangeFileChange = (event) => {
    setIsLoading(true);
    event.preventDefault();
    let file = event.target.files[0];
    setImageFile(file);
    // Presigned put url을 가져옴.
    const fileExtension = file.name.split('.').pop();
    getPresignedPutURL({
      variables: {
        key: `profile/${userId}/${new Date().getTime()}.${fileExtension}`,
      },
    });
  };
  const onChangeNickname = (event) => {
    setUser({
      ...user,
      nickname: event.target.value,
    });
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {(queryLoading || isLoading) && <Loading />}
        <Grid className={classes.content} container spacing={4}>
          <Grid className={classes.contentTitle} item xs={12}>
            <Typography variant='h6' gutterBottom>
              회원 정보 수정
            </Typography>
            <Button color='primary' variant='outlined' onClick={onClickSaveBtn}>
              확인
            </Button>
            <Button
              color='primary'
              variant='outlined'
              onClick={onClickCancelBtn}
            >
              취소
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Typography gutterBottom>프로필</Typography>
          </Grid>
          <Grid item xs={9}>
            <div className={classes.profileWrapper}>
              {user?.profileImageURL ? (
                <>
                  <Suspense fallback={null}>
                    <ImageComponent imageURL={user?.profileImageURL} />
                  </Suspense>
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={onClickDeleteBtn}
                  >
                    삭제
                  </Button>
                </>
              ) : (
                <label htmlFor='image-upload-input-tag'>
                  <Avatar
                    classes={{ root: classes.defaultProfile }}
                    alt='Avatar'
                    src={''}
                  />
                  <input
                    id='image-upload-input-tag'
                    type='file'
                    accept='image/*'
                    onChange={onChangeFileChange}
                  />
                </label>
              )}
            </div>
          </Grid>
          <Grid item xs={3}>
            <Typography gutterBottom>닉네임</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField onChange={onChangeNickname} value={user?.nickname} />
          </Grid>
        </Grid>
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
export default UserEdit;
