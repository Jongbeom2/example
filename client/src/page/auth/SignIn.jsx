import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
import { LOGIN } from './auth.query';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  MESSAGE_SIGNIN_FAIL_INVALID_USER,
  MESSAGE_INPUT_FAIL_ALL_REQUIRED,
  MESSAGE_SIGNIN_SUCCESS_SIGNIN,
} from 'src/res/message';
import Loading from 'src/components/Loading';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: '30rem',
    position: 'relative',
  },
  content: {
    width: '15rem',
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  btn: {
    marginBottom: theme.spacing(1),
  },
  socialSignInText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  socialSignInBtnWrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& div': {
      background: 'red',
      width: '3rem',
      height: '3rem',
      borderRadius: '3rem',
    },
    cursor: 'pointer',
  },
}));
const Signin = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useLazyQuery(LOGIN);
  useEffect(() => {
    if (error) {
      alert(MESSAGE_SIGNIN_FAIL_INVALID_USER);
    }
  }, [error]);
  useEffect(() => {
    if (data && !error) {
      alert(MESSAGE_SIGNIN_SUCCESS_SIGNIN);
      history.push('/home');
    }
  }, [data]);
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onClickSignUpBtn = () => {
    history.push('/signup');
  };
  const onClickSignInBtn = () => {
    if (email === '' || password === '') {
      alert(MESSAGE_INPUT_FAIL_ALL_REQUIRED);
      return;
    }
    login({
      variables: {
        email,
        password,
      },
    });
  };
  return (
    <div className={classes.root}>
      {loading && <Loading />}
      <div className={classes.content}>
        <Typography align='center' gutterBottom color='primary' variant='h6'>
          로그인
        </Typography>
        <TextField
          className={classes.textField}
          fullWidth
          label='이메일'
          variant='outlined'
          onChange={onChangeEmail}
        />
        <TextField
          className={classes.textField}
          fullWidth
          label='비밀번호'
          variant='outlined'
          onChange={onChangePassword}
        />
        <Button
          className={classes.btn}
          fullWidth
          variant='contained'
          color='primary'
          onClick={onClickSignInBtn}
        >
          로그인
        </Button>
        <Button
          className={classes.btn}
          fullWidth
          variant='text'
          color='primary'
          onClick={onClickSignUpBtn}
        >
          회원 가입
        </Button>
        <Typography
          className={classes.socialSignInText}
          align='center'
          variant='body1'
          color='textSecondary'
        >
          SNS 계정으로 간편 로그인
        </Typography>
        <div className={classes.socialSignInBtnWrapper}>
          <div>카카오톡</div>
          <div>네이버</div>
          <div>구글</div>
        </div>
      </div>
    </div>
  );
};
export default Signin;
