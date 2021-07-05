import {Divider, useTheme} from 'react-native-paper';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button, Checkbox} from 'react-native-paper';
import {useState} from 'react/cjs/react.development';
import {ScrollView} from 'react-native-gesture-handler';
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
  contentContainer: {
    padding: 10,
    height: 200,
    width: '100%',
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
const OnboardingMain = () => {
  const theme = useTheme();
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const onPressCheckBox1 = () => {
    setIsChecked1(prev => !prev);
  };
  const onPressCheckBox2 = () => {
    setIsChecked2(prev => !prev);
  };
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.titleContainer}>개인정보 처리방침</Text>
      <Text
        style={[
          {backgroundColor: theme.colors.custom.white},
          styles.contentContainer,
        ]}>
        내용
      </Text>
      <View style={styles.flexContainer}>
        <Text>확인하기</Text>
        <Checkbox
          status={isChecked1 ? 'checked' : 'unchecked'}
          onPress={onPressCheckBox1}
        />
      </View>
      <Text style={[styles.titleContainer2]}>사용자 이용 약관</Text>
      <Text
        style={[
          {backgroundColor: theme.colors.custom.white},
          styles.contentContainer,
        ]}>
        내용
      </Text>
      <View style={styles.flexContainer}>
        <Text>동의하기</Text>
        <Checkbox
          status={isChecked2 ? 'checked' : 'unchecked'}
          onPress={onPressCheckBox2}
        />
      </View>
      <Button style={styles.confirmBtn} mode="contained">
        확인
      </Button>
    </ScrollView>
  );
};
export default OnboardingMain;
