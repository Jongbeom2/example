import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar, useTheme} from 'react-native-paper';
const styles = StyleSheet.create({
  root: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  nameWrapper: {
    flexShrink: 1,
    marginLeft: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  recentMessage: {
    marginTop: 5,
  },
  userNum: {
    marginLeft: 20,
    minWidth: 50,
  },
});
const RoomCard = ({room, navigation, userId}) => {
  const {colors} = useTheme();
  const onPress = () => {
    navigation.navigate('roomdetail', {
      roomId: room._id,
      userId,
    });
  };
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Avatar.Image size={40} label="A" />
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{getShortStr(room?.name)}</Text>
        <Text
          style={[{color: colors.custom.textSecondary}, styles.recentMessage]}>
          {getShortStr(room?.recentMessageContent)}
        </Text>
      </View>
      <Text style={[{color: colors.custom.textSecondary}, styles.userNum]}>
        {room?.userNum} 명
      </Text>
    </TouchableOpacity>
  );
};
const getShortStr = str => {
  if (!str) {
    return '';
  } else if (str.length > 20) {
    return str.slice(0, 20) + '...';
  } else {
    return str;
  }
};
export default RoomCard;
