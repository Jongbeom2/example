import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
const styles = StyleSheet.create({
  systemChatRoot: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  systemChatText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  myChatRoot: {
    maxWidth: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  myChatText: {
    maxWidth: '50%',
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  chatRoot: {
    maxWidth: '100%',
    marginVertical: 5,
    flexDirection: 'row',
  },
  chatAvatar: {
    marginLeft: 5,
  },
  chatUserWrapper: {
    marginLeft: 5,
    maxWidth: '50%',
  },
  chatNickname: {},
  chatText: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
const ChatCard = ({chat, userId}) => {
  const {colors} = useTheme();
  if (chat.isSystem) {
    return (
      <View style={styles.systemChatRoot}>
        <Text
          style={[
            {backgroundColor: colors.primaryDrak, color: colors.custom.white},
            styles.systemChatText,
          ]}>
          {chat.user.nickname + chat.content}
        </Text>
      </View>
    );
  }
  // 내 채팅
  if (chat.user._id === userId) {
    return (
      <View style={styles.myChatRoot}>
        <Text
          style={[{backgroundColor: colors.custom.yellow}, styles.myChatText]}>
          {chat.content}
        </Text>
      </View>
    );
  }
  // 상대 채팅
  return (
    <View style={styles.chatRoot}>
      <Avatar.Image
        style={styles.chatAvatar}
        size={40}
        label="A"
        source={{uri: chat.user?.profileThumbnailImageURL}}
      />
      <View style={styles.chatUserWrapper}>
        <Text style={styles.chatNickname}>{chat.user?.nickname}</Text>
        <Text style={[{backgroundColor: colors.custom.white}, styles.chatText]}>
          {chat.content}
        </Text>
      </View>
    </View>
  );
};
export default ChatCard;
