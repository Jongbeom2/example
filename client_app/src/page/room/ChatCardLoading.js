import {useTheme} from 'react-native-paper';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Loading from 'src/component/Loading';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  content: {
    width: '50%',
    height: 100,
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
const ChatCardLoading = () => {
  const {colors} = useTheme();

  return (
    <View style={styles.root}>
      <View style={[{backgroundColor: colors.custom.grey}, styles.content]}>
        <Loading />
      </View>
    </View>
  );
};
export default ChatCardLoading;
