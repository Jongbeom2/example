import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import queryString from 'query-string';
import { useHistory } from 'react-router';
import {
  MESSAGE_SIGNIN_FAIL_KAKAO,
  MESSAGE_SIGNIN_SUCCESS_KAKAO,
} from 'src/res/message';
import Loading from 'src/components/Loading';
import { SIGNIN_WITH_KAKAO } from './auth.query';
import { useMutation } from '@apollo/client';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
  },
}));
const SignInKakao = () => {
  const classes = useStyles();
  const history = useHistory();
  const code = queryString.parse(history.location.search).code;
  const [signInWithKakao, { data, loading, error }] = useMutation(
    SIGNIN_WITH_KAKAO,
  );
  useEffect(() => {
    if (error) {
      alert(MESSAGE_SIGNIN_FAIL_KAKAO);
      history.push('/signin');
    }
  }, [error]);
  useEffect(() => {
    if (data && !error) {
      alert(MESSAGE_SIGNIN_SUCCESS_KAKAO);
      history.push('/home');
    }
  }, [data]);
  useEffect(() => {
    if (code) {
      (async function () {
        try {
          // code값을 이용하여 accesstoken 받음.
          const formData = {
            grant_type: 'authorization_code',
            client_id: '142e7c33d8214ee72b5622f947c4cc1a',
            code,
          };
          const result = await axios.post(
            `https://kauth.kakao.com/oauth/token?${queryString.stringify(
              formData,
            )}`,
          );
          signInWithKakao({
            variables: {
              signInWithKakaoInput: {
                accessToken: result.data.access_token,
              },
            },
          });
          // accesstoken 서버에 전달하여 로그인 또는 회원가입함.
        } catch (error) {
          alert(MESSAGE_SIGNIN_FAIL_KAKAO);
          history.push('/signin');
        }
      })();
    } else {
      alert(MESSAGE_SIGNIN_FAIL_KAKAO);
      history.push('/signin');
    }
  }, []);
  return (
    <div className={classes.root}>
      <Loading />
    </div>
  );
};
export default SignInKakao;
