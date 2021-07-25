import {useMutation} from '@apollo/client';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Animated, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_INPUT_ALL_REQUIRED,
  MESSAGE_SUCCESS_UPDATE_USER,
  MESSAGE_TITLE,
} from 'src/res/message';
import {UPDATE_USER} from '../user/user.query';
const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 20,
  },
  btn: {
    width: 300,
  },
  textInput: {
    marginBottom: 20,
    width: 300,
    height: 50,
  },
});
const OnboardingNickname = ({userId, onPressConfirmBtn}) => {
  const {colors} = useTheme();
  const authContext = useContext(AuthContext);
  const [nickname, setNickname] = useState('');
  // 애니메이션
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  // 유저 정보 업데이트
  const [
    updateUser,
    {data: mutationData, loading: mutaionLoading, error: mutationError},
  ] = useMutation(UPDATE_USER);
  // 유저 정보 수정 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      onPressConfirmBtn();
    }
  }, [mutationData, mutationError, onPressConfirmBtn]);
  // 유저 정보 수정 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      authContext.signOut();
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError, authContext]);
  const onChageNickname = text => {
    setNickname(text);
  };
  const onPressSaveBtn = () => {
    if (nickname === '') {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_INPUT_ALL_REQUIRED);
      return;
    }
    updateUser({
      variables: {
        updateUserInput: {
          _id: userId,
          nickname,
        },
      },
    });
  };
  if (mutaionLoading) {
    <Loading />;
  }
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}>
      <KeyboardAvoidingView
        style={[styles.root, {backgroundColor: colors.custom.white}]}>
        <Text style={styles.title}>닉네임을 설정해주세요!</Text>
        <TextInput
          style={styles.textInput}
          placeholder="닉네임"
          onChangeText={onChageNickname}
        />
        <Button style={styles.btn} mode="contained" onPress={onPressSaveBtn}>
          닉네임 설정하기
        </Button>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default OnboardingNickname;
