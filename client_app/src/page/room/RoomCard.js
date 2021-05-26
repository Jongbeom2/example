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
  name: {
    flexShrink: 1,
    marginLeft: 20,
    textAlignVertical: 'center',
  },
  userNum: {
    marginLeft: 20,
    minWidth: 50,
    textAlignVertical: 'center',
  },
});
const RoomCard = ({room, navigation}) => {
  return (
    <TouchableOpacity style={styles.root}>
      <Avatar.Image size={40} label="A" />
      <Text style={styles.name}>{room?.name}</Text>
      {/* <Text>{room?.recentMessageContent}</Text> */}
      <Text style={styles.userNum}>{room?.userNum} 명</Text>
    </TouchableOpacity>
  );
};
export default RoomCard;
