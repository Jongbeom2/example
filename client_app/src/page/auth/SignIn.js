import React, {useState, useEffect, useContext} from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {AuthContext} from 'src/Main';
import {TextInput, Button, useTheme} from 'react-native-paper';
import {Text} from 'react-native-paper';
import {useMutation} from '@apollo/client';
import {SIGNIN, SIGNIN_WITH_KAKAO} from 'src/page/auth/auth.query';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_INPUT_ALL_REQUIRED,
  MESSAGE_ERROR_SIGNIN_INVALID_USER,
  MESSAGE_ERROR_SIGNIN_KAKAO,
  MESSAGE_SUCCESS_SIGNIN,
  MESSAGE_SUCCESS_SIGNIN_KAKAO,
  MESSAGE_TITLE,
} from 'src/res/message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {websocketLink} from 'src/apollo/link';
import Loading from 'src/component/Loading';
// import {login} from '@react-native-seoul/kakao-login';
import messaging from '@react-native-firebase/messaging';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginBottom: 20,
    width: 300,
    height: 50,
  },
  signInBtn: {
    marginBottom: 20,
    width: 300,
  },
  signUpBtn: {
    marginBottom: 20,
    width: 300,
  },
  text: {
    marginBottom: 20,
  },
  btnWrapper: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialSignInBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
const SignIn = ({navigation}) => {
  const {colors} = useTheme();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. 로그인
  const [mutationSignIn, {data, loading, error}] = useMutation(SIGNIN);
  // 로그인 성공
  useEffect(() => {
    if (data && !error) {
      (async () => {
        await AsyncStorage.setItem('userId', data.signIn._id);
        // 참고자료 : https://github.com/apollographql/subscriptions-transport-ws/issues/171 (옛날 코드라 정확하지 않아 참고만함)
        // cookie가 만료되더라도 subscription은 유지됨.
        // 이를 대비하여 로그인할 때 subscription을 다시 연결함.
        // websocketLink.subscriptionClient는 SubscriptionClient 객체임.
        // https://github.com/apollographql/subscriptions-transport-ws
        websocketLink.subscriptionClient.close(false, false);
        authContext.signIn(data.signIn._id);
        Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNIN);
      })();
    }
  }, [data, error, authContext]);
  // 로그인 실패
  useEffect(() => {
    if (error) {
      if (error.message === 'INVALID_USER_INFO') {
        Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_SIGNIN_INVALID_USER);
      } else {
        Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
      }
    }
  }, [error]);
  // 2. 카카오 로그인
  const [
    signInWithKakao,
    {data: mutationData, loading: mutationLoading, error: mutationError},
  ] = useMutation(SIGNIN_WITH_KAKAO);
  // 카카오 로그인 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      (async () => {
        websocketLink.subscriptionClient.close(false, false);
        authContext.signIn(mutationData.signInWithKakao._id);
        Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNIN_KAKAO);
      })();
    }
  }, [mutationData, mutationError, authContext]);
  // 카카오 로그인 실패
  useEffect(() => {
    if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_SIGNIN_KAKAO);
    }
  }, [mutationError]);
  const onChangeEmail = text => {
    setEmail(text);
  };
  const onChangePassword = text => {
    setPassword(text);
  };
  const onClickSignInBtn = async () => {
    if (email === '' || password === '') {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_INPUT_ALL_REQUIRED);
      return;
    }
    const fcmToken = await messaging().getToken();
    mutationSignIn({
      variables: {
        signInInput: {
          email,
          password,
          fcmToken,
        },
      },
    });
  };
  const onClickKakoSignInBtn = async () => {
    // let token;
    // try {
    //   token = await login();
    // } catch (e) {
    //   return;
    // }
    // const fcmToken = await messaging().getToken();
    // signInWithKakao({
    //   variables: {
    //     signInWithKakaoInput: {
    //       accessToken: token.accessToken,
    //       fcmToken,
    //     },
    //   },
    // });
  };
  if (loading || mutationLoading) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.root}>
      <TextInput
        style={styles.textInput}
        placeholder="이메일"
        onChangeText={onChangeEmail}
      />
      <TextInput
        style={styles.textInput}
        placeholder="비밀번호"
        onChangeText={onChangePassword}
        secureTextEntry={true}
      />
      <Button
        style={styles.signInBtn}
        onPress={onClickSignInBtn}
        mode="contained">
        로그인
      </Button>
      <Button
        style={styles.signUpBtn}
        onPress={() => {
          navigation.navigate('signup');
        }}>
        회원가입
      </Button>
      <Text style={[styles.text, {color: colors.custom.textSecondary}]}>
        SNS 계정으로 간편 로그인
      </Text>
      <View style={styles.btnWrapper}>
        <Button
          color={colors.custom.textPrimary}
          contentStyle={[
            styles.socialSignInBtn,
            {
              backgroundColor: colors.custom.kakao,
            },
          ]}
          onPress={onClickKakoSignInBtn}>
          K
        </Button>
        <Button
          color={colors.custom.textPrimary}
          contentStyle={[
            styles.socialSignInBtn,
            {
              backgroundColor: colors.custom.naver,
            },
          ]}
          onPress={() => {}}>
          N
        </Button>
        <Button
          color={colors.custom.textPrimary}
          contentStyle={[
            styles.socialSignInBtn,
            {
              backgroundColor: colors.custom.google,
            },
          ]}
          onPress={() => {}}>
          G
        </Button>
      </View>
    </SafeAreaView>
  );
};
export default SignIn;
