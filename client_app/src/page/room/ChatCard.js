import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Avatar, Button, Text, useTheme} from 'react-native-paper';
import ChatCardImage from 'src/page/room/ChatCardImage';
import invalidImage from 'src/res/img/invalid_image.png';
import RNFetchBlob from 'rn-fetch-blob';
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
  myChatFile: {
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
  chatFile: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
const ChatCard = ({chat, userId}) => {
  const {colors} = useTheme();
  const onPressFile = () => {
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${chat.fileName}`,
        description: 'File',
      },
    })
      .fetch('GET', chat.fileURL, {
        //some headers ..
      })
      .then(res => {
        // the temp file path
        console.log('The file saved to ', res.path());
      });
  };
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
        {chat.imageURL ? (
          <ChatCardImage
            sourceList={[
              chat.thumbnailImageURL,
              chat.imageURL,
              Image.resolveAssetSource(invalidImage).uri,
            ]}
          />
        ) : chat.fileURL ? (
          <Button
            style={styles.myChatFile}
            color={colors.primaryDrak}
            mode="contained"
            onPress={onPressFile}>
            {chat.fileName}
          </Button>
        ) : (
          <Text
            style={[
              {backgroundColor: colors.custom.yellow},
              styles.myChatText,
            ]}>
            {chat.content}
          </Text>
        )}
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
        {chat.imageURL ? (
          <ChatCardImage
            sourceList={[
              chat.thumbnailImageURL,
              chat.imageURL,
              Image.resolveAssetSource(invalidImage).uri,
            ]}
          />
        ) : chat.fileURL ? (
          <Button
            style={styles.chatFile}
            color={colors.primaryDrak}
            mode="contained"
            onPress={onPressFile}>
            {chat.fileName}
          </Button>
        ) : (
          <Text
            style={[{backgroundColor: colors.custom.white}, styles.chatText]}>
            {chat.content}
          </Text>
        )}
      </View>
    </View>
  );
};
export default React.memo(ChatCard);
