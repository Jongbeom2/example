import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
import {useMutation} from '@apollo/client';
import {CREATE_USER} from './auth.query';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_INPUT_ALL_REQUIRED,
  MESSAGE_ERROR_SIGNUP_EXIST_EMAIL,
  MESSAGE_SUCCESS_SIGNUP,
  MESSAGE_TITLE,
} from '../../res/message';
import Loading from '../../component/Loading';
import PolicyMain from '../policy/PolicyMain';
import logo from 'src/res/img/logo.png';
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
  text: {
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});
const SignUp = ({navigation}) => {
  const {colors} = useTheme();
  const [isAgree, setIsAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  // 회원가입
  const [createUser, {data, loading, error}] = useMutation(CREATE_USER);
  const onChangeEmail = text => {
    setEmail(text);
  };
  // 회원가입 성공
  useEffect(() => {
    if (data && !error) {
      navigation.navigate('signin');
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNUP);
    }
  }, [data, error, navigation]);
  // 회원가입 실패
  useEffect(() => {
    if (error) {
      if (error.message === 'EXIST_USER_EMAIL') {
        Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_SIGNUP_EXIST_EMAIL);
      } else {
        Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
      }
    }
  }, [error]);
  const onChangePassword = text => {
    setPassword(text);
  };
  const onChangePassword2 = text => {
    setPassword2(text);
  };
  const onChangeNickname = text => {
    setNickname(text);
  };
  const onPressSignUpBtn = () => {
    if (
      email === '' ||
      password === '' ||
      password2 === '' ||
      nickname === ''
    ) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_INPUT_ALL_REQUIRED);
      return;
    }
    createUser({
      variables: {
        createUserInput: {
          email,
          password,
          nickname,
        },
      },
    });
  };
  const onPressConfirmBtn = () => {
    setIsAgree(true);
  };
  if (loading) {
    return <Loading />;
  }
  if (!isAgree) {
    return <PolicyMain onPressConfirmBtn={onPressConfirmBtn} />;
  }
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image style={styles.logo} source={logo} />
      <Text style={[styles.text, {color: colors.custom.textSecondary}]}>
        맘톡, 엄마들의 이야기
      </Text>
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
      <TextInput
        style={styles.textInput}
        placeholder="비밀번호 확인"
        onChangeText={onChangePassword2}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.textInput}
        placeholder="닉네임"
        onChangeText={onChangeNickname}
      />

      <Button
        style={styles.signInBtn}
        onPress={onPressSignUpBtn}
        mode="contained">
        회원가입
      </Button>
      <Button
        style={styles.signUpBtn}
        onPress={() => {
          navigation.navigate('signin');
        }}>
        이미 회원이신가요?
      </Button>
    </KeyboardAvoidingView>
  );
};
export default SignUp;
