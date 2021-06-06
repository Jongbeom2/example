import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar, useTheme} from 'react-native-paper';
import {getShortStr} from 'src/lib/common';
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
    navigation.navigate('roomdetaildrawer', {
      roomId: room._id,
      roomName: room.name,
      userId,
    });
  };
  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Avatar.Image size={40} label="A" />
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{getShortStr(room?.name, 20)}</Text>
        <Text
          style={[{color: colors.custom.textSecondary}, styles.recentMessage]}>
          {getShortStr(room?.recentMessageContent, 20)}
        </Text>
      </View>
      <Text style={[{color: colors.custom.textSecondary}, styles.userNum]}>
        {room?.userNum} 명
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(RoomCard);
