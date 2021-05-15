import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_USER, UPDATE_USER } from './user.query';
import { useHistory, useParams } from 'react-router';
import { MESSAGE_ERROR, MESSAGE_USER_FAIL } from 'src/res/message';
import Loading from 'src/components/Loading';
import MainWrapper from 'src/components/MainWrapper';
import { Avatar, Button, Grid, TextField, Typography } from '@material-ui/core';
import { GET_PRESIGNED_PUT_URL } from 'src/lib/file.query';
import axios from 'axios';
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
    variables: { userId: userId },
  });
  // 이미지 업로드용 presigned url 로드
  const [
    getPresignedPutURL,
    { data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError },
  ] = useLazyQuery(GET_PRESIGNED_PUT_URL);
  // 유저 정보 업데이트
  const [
    updateUser,
    { data: mutationData, loading: mutaionLoading, error: mutationError },
  ] = useMutation(UPDATE_USER);
  // 유저 정보 로드 성공
  useEffect(() => {
    if (queryData && !queryError) {
      setUser(queryData.getUser);
    }
  }, [queryData]);
  // 유저 정보 로드 실패
  useEffect(() => {
    if (queryError) {
      if (queryError.message === 'INVALID_USER_ID') {
        alert(MESSAGE_USER_FAIL);
      } else {
        alert(MESSAGE_ERROR);
      }
    }
  }, [queryError]);
  // presigned url 로드 성공
  useEffect(() => {
    if (lazyQueryData && !lazyQueryError) {
      const presignedURL = lazyQueryData.getPresignedPutURL.presignedURL;
      (async function () {
        try {
          // Presigned put url을 이용하여 업로드
          const result = await axios.put(presignedURL, imageFile);
          const url = result.config.url.split('?')[0];
          setUser({
            ...user,
            profileImageURL: url,
            profileThumbnailImageURL: url.replace(
              'profile',
              'profileThumbnail',
            ),
          });
        } catch (error) {
          alert('사진 업로드 실패');
        }
        setIsLoading(false);
      })();
    }
  }, [lazyQueryData]);
  // 유저 정보 수정 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      alert('유저 정보 수정');
      history.push(`/user/${userId}`);
    }
  }, [mutationData]);
  // 유저 정보 수정 실패
  useEffect(() => {
    if (mutationError) {
      if (mutationError.message === 'INVALID_USER_ID') {
        alert(MESSAGE_USER_FAIL);
      } else {
        alert(MESSAGE_ERROR);
      }
    }
  }, [mutationError]);
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
          profileThumbnailImageURL: user.profileThumbnailImageURL,
        },
      },
    });
  };
  const onClickDeleteBtn = () => {
    setUser({ ...user, profileImageURL: '', profileThumbnailImageURL: '' });
  };
  const onChangeFileChange = (event) => {
    setIsLoading(true);
    event.preventDefault();
    let file = event.target.files[0];
    setImageFile(file);
    // Presigned put url을 가져옴.
    getPresignedPutURL({
      variables: {
        key: `profile/${userId}/${new Date().getTime()}.png`,
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
                  <Avatar alt='Avatar' src={user?.profileImageURL || ''} />
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
                    src={user?.profileImageURL || ''}
                  />
                  <input
                    id='image-upload-input-tag'
                    type='file'
                    accept='image/jpg,image/png,image/jpeg,image/gif'
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
export default UserEdit;
