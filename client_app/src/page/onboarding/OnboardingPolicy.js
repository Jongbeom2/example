import {useTheme} from 'react-native-paper';
import React from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import PolicyPrivateInfo from './PolicyPrivateInfo';
import PolicyUse from './PolicyUse';
const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 20,
  },
  btn: {
    width: 300,
    marginTop: 30,
  },
});
const OnboardingPolicy = ({onPressConfirmBtn}) => {
  const {colors} = useTheme();
  return (
    <KeyboardAvoidingView
      style={[styles.root, {backgroundColor: colors.custom.white}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}> 맘톡이 처음이시군요</Text>
      <Text style={styles.title}>이용 약관에 동의해주세요</Text>
      <PolicyPrivateInfo />
      <PolicyUse />
      <Button style={styles.btn} mode="contained" onPress={onPressConfirmBtn}>
        동의하기
      </Button>
    </KeyboardAvoidingView>
  );
};
export default OnboardingPolicy;
