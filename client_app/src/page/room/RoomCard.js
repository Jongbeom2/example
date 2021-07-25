import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {getShortStr} from 'src/lib/common';
const styles = StyleSheet.create({
  root: {
    padding: 10,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 5,
  },
  nameWrapper: {
    flexShrink: 1,
    marginLeft: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  recentMessage: {
    marginVertical: 10,
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
    <TouchableOpacity
      style={[styles.root, {backgroundColor: colors.custom.white}]}
      onPress={onPress}>
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
