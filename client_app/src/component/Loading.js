import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const Loading = ({type = 'default', ...rest}) => {
  const {colors} = useTheme();
  if (type === 'default') {
    return (
      <View style={styles.root}>
        <ActivityIndicator animating={true} color={colors.primary} />
      </View>
    );
  } else if (type === 'line') {
    return <ActivityIndicator animating={true} color={colors.primary} />;
  } else {
    return <ActivityIndicator animating={true} color={colors.primary} />;
  }
};
export default Loading;
