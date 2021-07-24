import {useTheme} from 'react-native-paper';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import PrivateInfoPolicy from './PrivateInfoPolicy';
import UsePolicy from './UsePolicy';
const styles = StyleSheet.create({
  root: {
    padding: 10,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleContainer2: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
  },
  flexContainer: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  confirmBtn: {
    marginTop: 20,
  },
});
const OnboardingMain = ({onPressConfirmBtn}) => {
  const onPress = () => {
    onPressConfirmBtn();
  };
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.titleContainer}>개인정보 처리방침</Text>
      <PrivateInfoPolicy />
      <Text style={[styles.titleContainer2]}>사용자 이용 약관</Text>
      <UsePolicy />
      <Button style={styles.confirmBtn} mode="contained" onPress={onPress}>
        동의하기
      </Button>
    </ScrollView>
  );
};
export default OnboardingMain;
