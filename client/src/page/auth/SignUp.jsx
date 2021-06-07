import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { Button, TextField, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from 'src/page/auth/auth.query';
import Loading from 'src/components/Loading';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_INPUT_ALL_REQUIRED,
  MESSAGE_ERROR_SIGNUP_EXIST_EMAIL,
  MESSAGE_SUCCESS_SIGNUP,
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
}));
const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  // 회원가입
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  // 회원가입 성공
  useEffect(() => {
    if (data && !error) {
      alert(MESSAGE_SUCCESS_SIGNUP);
      history.push('/signin');
    }
  }, [data, error, history]);
  // 회원가입 실패
  useEffect(() => {
    if (error) {
      if (error.message === 'EXIST_USER_EMAIL') {
        alert(MESSAGE_ERROR_SIGNUP_EXIST_EMAIL);
      } else {
        alert(MESSAGE_ERROR);
      }
    }
  }, [error]);
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
      alert(MESSAGE_ERROR_INPUT_ALL_REQUIRED);
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
      </div>
    </div>
  );
};
export default SignUp;
