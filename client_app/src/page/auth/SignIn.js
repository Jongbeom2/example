import React, {useState, useContext} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {AuthContext} from '../../../App';
import {TextInput, Button} from 'react-native-paper';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputEmail: {
    marginBottom: 20,
    width: 300,
    height: 50,
  },
  textInputPassword: {
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
});
const SignIn = () => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [passowrd, setPassword] = useState('');
  const onChangeEmail = text => {
    setEmail(text);
  };
  const onChangePassword = text => {
    setPassword(text);
  };
  return (
    <SafeAreaView style={styles.root}>
      <TextInput
        style={styles.textInputEmail}
        placeholder="이메일"
        onChangeText={onChangeEmail}
      />
      <TextInput
        style={styles.textInputPassword}
        placeholder="비밀번호"
        onChangeText={onChangePassword}
      />
      <Button
        style={styles.signInBtn}
        onPress={() => signIn(email, passowrd)}
        mode="contained">
        로그인
      </Button>
      <Button style={styles.signUpBtn} onPress={() => {}}>
        회원가입
      </Button>
    </SafeAreaView>
  );
};
export default SignIn;
