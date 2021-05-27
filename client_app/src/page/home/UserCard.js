import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
const UserCard = ({navigation, user}) => {
  const onPress = () => {
    navigation.navigate('user', {
      userId: user._id,
    });
  };
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Avatar.Image
        size={40}
        label="A"
        source={{uri: user?.profileThumbnailImageURL}}
      />
      <Text style={styles.nickname}>{user?.nickname}</Text>
    </TouchableOpacity>
  );
};
export default UserCard;
