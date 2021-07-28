import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Image, Alert} from 'react-native';
import {Avatar, Button, Text, useTheme} from 'react-native-paper';
import ChatCardImage from 'src/page/room/ChatCardImage';
import invalidImage from 'src/res/img/invalid_image.png';
import RNFetchBlob from 'rn-fetch-blob';
import {useMutation} from '@apollo/client';
import {ARCHIVE_CHAT} from './room.query';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {
  MESSAGE_CONFIRM_ARCHIEVE_CHAT,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS_ARCHIVE_CHAT,
  MESSAGE_TITLE,
} from 'src/res/message';
import {useState} from 'react/cjs/react.development';
const styles = StyleSheet.create({
  systemChatRoot: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  systemChatText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: 'hidden',
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
    overflow: 'hidden',
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
    alignItems: 'baseline',
  },
  chatNickname: {},
  chatText: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    overflow: 'hidden',
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
  const authContext = useContext(AuthContext);
  const [isArchived, setIsArchived] = useState(chat.isArchived);
  // 신고
  const [
    archiveChat,
    {data: mutationData, loading: mutationLoading, error: mutationError},
  ] = useMutation(ARCHIVE_CHAT);
  // 신고 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_ARCHIVE_CHAT);
      setIsArchived(true);
    }
  }, [mutationData, mutationError]);
  // 신고 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      authContext.signOut();
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError, authContext]);
  // 파일 다운로드
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
  const onLongPress = () => {
    Alert.alert(MESSAGE_TITLE, MESSAGE_CONFIRM_ARCHIEVE_CHAT, [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '신고하기',
        onPress: () =>
          archiveChat({
            variables: {
              archiveChatInput: {
                _id: chat._id,
              },
            },
          }),
      },
    ]);
  };
  // 시스템 채팅
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
        {isArchived ? (
          <Text
            style={[
              {
                backgroundColor: colors.custom.yellow,
                color: colors.custom.textSecondary,
              },
              styles.myChatText,
            ]}>
            ! 신고된 대화입니다.
          </Text>
        ) : chat.imageURL ? (
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
        {isArchived ? (
          <Text
            style={[
              {
                backgroundColor: colors.custom.white,
                color: colors.custom.textSecondary,
              },
              styles.chatText,
            ]}>
            ! 신고된 대화입니다.
          </Text>
        ) : chat.imageURL ? (
          <ChatCardImage
            sourceList={[
              chat.thumbnailImageURL,
              chat.imageURL,
              Image.resolveAssetSource(invalidImage).uri,
            ]}
            onLongPress={onLongPress}
          />
        ) : chat.fileURL ? (
          <Button
            style={styles.chatFile}
            color={colors.primaryDrak}
            mode="contained"
            onPress={onPressFile}
            onLongPress={onLongPress}>
            {chat.fileName}
          </Button>
        ) : (
          <Text
            style={[{backgroundColor: colors.custom.white}, styles.chatText]}
            onLongPress={onLongPress}>
            {chat.content}
          </Text>
        )}
      </View>
    </View>
  );
};
export default React.memo(ChatCard);
