import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
import { SINGIN } from './auth.query';
import { useMutation } from '@apollo/client';
import {
  MESSAGE_ERROR_SIGNIN_INVALID_USER,
  MESSAGE_ERROR_INPUT_ALL_REQUIRED,
  MESSAGE_SUCCESS_SIGNIN,
  MESSAGE_ERROR,
} from 'src/res/message';
import Loading from 'src/components/Loading';
import { websocketLink } from 'src/apollo/client';

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
      lineHeight: '3rem',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    cursor: 'pointer',
  },
}));
const Signin = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 로그인
  const [signIn, { data, loading, error }] = useMutation(SINGIN);
  // 로그인 성공
  useEffect(() => {
    if (data && !error) {
      // 참고자료 : https://github.com/apollographql/subscriptions-transport-ws/issues/171 (옛날 코드라 정확하지 않아 참고만함)
      // cookie가 만료되더라도 subscription은 유지됨.
      // 이를 대비하여 로그인할 때 subscription을 다시 연결함.
      // websocketLink.subscriptionClient는 SubscriptionClient 객체임.
      // https://github.com/apollographql/subscriptions-transport-ws
      websocketLink.subscriptionClient.close(false, false);
      alert(MESSAGE_SUCCESS_SIGNIN);
      history.push('/home');
    }
  }, [data, error, history]);
  // 로그인 실패
  useEffect(() => {
    if (error) {
      if (error.message === 'INVALID_USER_INFO') {
        alert(MESSAGE_ERROR_SIGNIN_INVALID_USER);
      } else {
        alert(MESSAGE_ERROR);
      }
    }
  }, [error]);
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
      alert(MESSAGE_ERROR_INPUT_ALL_REQUIRED);
      return;
    }
    signIn({
      variables: {
        signInInput: {
          email,
          password,
        },
      },
    });
  };
  const onClickKakaoSignInBtn = async () => {
    // 로그인 성공하면 code값과 함께 redirectUri로 redirect함.
    await window.Kakao.Auth.authorize({
      redirectUri: `${process.env.REACT_APP_DOMAIN}/signinkakao`,
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
          <div
            style={{ background: '#fee500' }}
            onClick={onClickKakaoSignInBtn}
          >
            K
          </div>
          <div
            style={{ background: '#04cf5c' }}
            onClick={() => {
              alert('준비중입니다.');
            }}
          >
            N
          </div>
          <div
            style={{ background: '#4f8df5' }}
            onClick={() => {
              alert('준비중입니다.');
            }}
          >
            G
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signin;
