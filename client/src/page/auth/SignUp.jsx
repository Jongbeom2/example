import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { Button, TextField, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from 'src/page/auth/auth.query';
import Loading from 'src/components/Loading';
import {
  MESSAGE_SIGNUP_FAIL_EXIST_EMAIL,
  MESSAGE_SIGNUP_SUCCESS,
} from 'src/res/message';
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
  socialSignUpText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  socialSignUpBtnWrapper: {
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
const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  useEffect(() => {
    if (error) {
      alert(MESSAGE_SIGNUP_FAIL_EXIST_EMAIL);
    }
  }, [error]);
  useEffect(() => {
    if (data && !error) {
      alert(MESSAGE_SIGNUP_SUCCESS);
      history.push('/signin');
    }
  }, [data]);
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword1 = (e) => {
    setPassword1(e.target.value);
  };
  const onChangePassword2 = (e) => {
    setPassword2(e.target.value);
  };
  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };
  const onClickSignInBtn = () => {
    history.push('/signin');
  };
  const onClickSignUpBtn = () => {
    if (
      email === '' ||
      password1 === '' ||
      password2 === '' ||
      nickname === ''
    ) {
      alert('모두필수');
      return;
    }
    createUser({
      variables: {
        createUserInput: {
          email,
          password: password1,
          nickname,
        },
      },
    });
  };

  return (
    <div className={classes.root}>
      {loading && <Loading />}
      <div className={classes.content}>
        <Typography align='center' gutterBottom color='primary' variant='h6'>
          회원가입
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
          onChange={onChangePassword1}
        />
        <TextField
          className={classes.textField}
          fullWidth
          label='비밀번호 확인'
          variant='outlined'
          onChange={onChangePassword2}
        />
        <TextField
          className={classes.textField}
          fullWidth
          label='닉네임'
          variant='outlined'
          onChange={onChangeNickname}
        />
        <Button
          className={classes.btn}
          fullWidth
          variant='contained'
          color='primary'
          onClick={onClickSignUpBtn}
        >
          회원가입
        </Button>
        <Button
          className={classes.btn}
          fullWidth
          variant='text'
          color='primary'
          onClick={onClickSignInBtn}
        >
          이미 회원이신가요?
        </Button>
        <Typography
          className={classes.socialSignUpText}
          align='center'
          variant='body1'
          color='textSecondary'
        >
          SNS 계정으로 간편 로그인
        </Typography>
        <div className={classes.socialSignUpBtnWrapper}>
          <div>카카오톡</div>
          <div>네이버</div>
          <div>구글</div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
