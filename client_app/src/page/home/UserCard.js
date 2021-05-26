import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
const styles = StyleSheet.create({
  root: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  nickname: {
    marginLeft: 20,
    textAlignVertical: 'center',
  },
});
const UserCard = ({user}) => {
  return (
    <View style={styles.root}>
      <Avatar.Image
        size={40}
        label="A"
        source={{uri: user?.profileThumbnailImageURL}}
      />
      <Text style={styles.nickname}>{user?.nickname}</Text>
    </View>
  );
};
export default UserCard;
