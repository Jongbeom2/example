import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { GET_USER } from './user.query';
import { useHistory, useParams } from 'react-router';
import { MESSAGE_ERROR, MESSAGE_USER_FAIL } from 'src/res/message';
import Loading from 'src/components/Loading';
import MainWrapper from 'src/components/MainWrapper';
import { Avatar, Button, Grid, TextField, Typography } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  content: {
    padding: theme.spacing(5),
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
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { _id: userId },
  });
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    if (error) {
      if (error.message === 'INVALID_USER_ID') {
        alert(MESSAGE_USER_FAIL);
      } else {
        alert(MESSAGE_ERROR);
      }
    }
  }, [error]);
  useEffect(() => {
    if (data && !error) {
      setUser(data.getUser);
    }
  }, [data]);
  const onClickCancelBtn = () => {
    history.push(`/user/${userId}`);
  };
  const onClickSaveBtn = () => {
    console.log(imageFile);
  };
  const onClickDeleteBtn = () => {
    setUser({ ...user, profileImageURL: '' });
  };
  const onChangeFileChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    setImageFile(file);
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setUser({
        ...user,
        profileImageURL: e.target.result,
      });
    };
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
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
                <label for='image-upload-input-tag'>
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
            <TextField value={user?.nickname} />
          </Grid>
        </Grid>
      </div>
    </MainWrapper>
  );
};
export default UserEdit;
