import {useLazyQuery, useMutation, useSubscription} from '@apollo/client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {
  CHAT_CREATED,
  CREATE_CHAT,
  GET_CHAT_LIST,
} from 'src/page/room/room.query';
import {
  isNotAuthorizedError,
  isNotAuthorizedErrorSubscription,
} from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_UPLOAD,
  MESSAGE_TITLE,
} from 'src/res/message';
import ChatCard from 'src/page/room/ChatCard';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {GET_PRESIGNED_PUT_URL} from 'src/lib/file.query';
import DocumentPicker from 'react-native-document-picker';
import {AuthContext} from 'src/Main';
import ChatCardLoading from './ChatCardLoading';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {REACT_APP_STORAGE_URL, REACT_APP_STORAGE_RESIZED_URL} from '@env';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  chatWrapper: {
    flex: 1,
  },
  inputWrapper: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    padding: 10,
  },
  inputPlusBtn: {
    height: 30,
  },
  inputSendBtn: {
    height: 30,
  },
  plusWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
  },
  icon: {
    marginRight: 10,
  },
});
const RoomDetail = ({route, navigation}) => {
  const PAGE_SIZE = 30;
  const roomId = route?.params.roomId;
  const userId = route?.params?.userId;
  const {colors} = useTheme();
  const authContext = useContext(AuthContext);
  let flatlistRef = useRef();
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [chatFile, setChatFile] = useState(null);
  const [isPlusBtnPressed, setIsPlusBtnPressed] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [hashedImageURL, setHashedImageURL] = useState(null);
  const [isImageResizing, setIsImageResizing] = useState(false);
  const intervalRef = useRef();
  const timeoutRef = useRef();
  // 1. ?????? ??????
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(CHAT_CREATED, {
    variables: {
      roomId,
    },
  });
  // ?????? ?????? ??????
  useEffect(() => {
    if (subscriptionData && !subscriptionError) {
      setChatList(preChatList => [
        subscriptionData.chatCreated,
        ...preChatList,
      ]);
    }
    return () => {};
  }, [subscriptionData, subscriptionError]);
  // ?????? ?????? ??????
  useEffect(() => {
    if (isNotAuthorizedErrorSubscription(subscriptionError)) {
      authContext.signOut();
    } else if (subscriptionError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [subscriptionError, authContext]);
  // 2. ?????? ??????
  const [
    getChatList,
    {data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError},
  ] = useLazyQuery(GET_CHAT_LIST);
  useEffect(() => {
    getChatList({
      variables: {
        roomId,
        size: PAGE_SIZE,
      },
    });
  }, [getChatList, roomId]);
  // ?????? ?????? ??????
  useEffect(() => {
    if (lazyQueryData && !lazyQueryError) {
      setChatList(preChatList => [
        ...preChatList,
        ...lazyQueryData.getChatList,
      ]);
      const chatListLength = lazyQueryData.getChatList.length;
      if (chatListLength) {
        setLastId(
          lazyQueryData.getChatList[lazyQueryData.getChatList.length - 1]._id,
        );
      }
    }
  }, [lazyQueryData, lazyQueryError, setChatList]);
  // ?????? ?????? ??????
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError)) {
      authContext.signOut();
    } else if (lazyQueryError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [lazyQueryError, authContext]);
  // 3. ?????? ??????
  const [
    createChat,
    {data: mutationData, loading: mutationLoading, error: mutationError},
  ] = useMutation(CREATE_CHAT);
  // ?????? ?????? ??????
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      authContext.signOut();
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError, authContext]);
  // 4. presigned url ??????
  const [
    getPresignedPutURL,
    {data: lazyQueryData2, loading: lazyQueryLoading2, error: lazyQueryError2},
  ] = useLazyQuery(GET_PRESIGNED_PUT_URL);
  // presigned url ?????? ??????
  useEffect(() => {
    if (lazyQueryData2 && !lazyQueryError2) {
      const presignedURL = lazyQueryData2.getPresignedPutURL.presignedURL;
      uplaodFile(presignedURL);
    }
  }, [lazyQueryData2, lazyQueryError2, uplaodFile]);
  // presigned url ?????? ??????
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError2)) {
      authContext.signOut();
    } else if (lazyQueryError2) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [lazyQueryError2, authContext]);
  // 5. ????????? ????????? ???????????? ?????? ????????? ?????? ???????????? muation ??????????????? ??????
  useEffect(() => {
    if (isImageResizing) {
      // 1??? ???????????? ????????? ????????? ??????
      setHashedImageURL(imageURL + `#${Date.now()}`);
      intervalRef.current = setInterval(() => {
        setHashedImageURL(imageURL + `#${Date.now()}`);
      }, 1000);
      // 10?????? ????????? ?????? ??? ????????? ?????? ???????????? interval, timeout ??????
      timeoutRef.current = setTimeout(() => {
        Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_UPLOAD);
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
        intervalRef.current = null;
        timeoutRef.current = null;
        setIsUploadLoading(false);
      }, 10000);
    }
    if (intervalRef.current && !isImageResizing) {
      // ????????? ?????? ????????? interval, timeout ??????
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
      createChat({
        variables: {
          createChatInput: {
            roomId,
            userId,
            content: '??????',
            imageURL: imageURL,
          },
        },
      });
      setIsUploadLoading(false);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [imageURL, isImageResizing, createChat, roomId, userId]);
  // presignedURL??? ???????????? ????????? ??? ?????? ??????????????? ??????
  const uplaodFile = useCallback(
    async presignedURL => {
      try {
        // Presigned put url??? ???????????? ?????????
        const file = await getBlob(chatFile.uri);
        const result = await fetch(presignedURL, {
          method: 'PUT',
          body: file,
        });
        const url = result.url.split('?')[0].replace(REACT_APP_STORAGE_URL, '');
        const type = file.data.type.split('/')[0];
        const name = file.data.name;
        if (type === 'image') {
          // ????????? ?????? ????????? ???????????? ??????????????? ???????????? ???????????? ?????? ?????? ??????
          // ?????? ?????? imageResizing state true??? ??????
          setImageURL(url);
          setIsImageResizing(true);
        } else {
          // ????????? ?????? ???????????? ?????? ????????? ?????? ??????
          createChat({
            variables: {
              createChatInput: {
                roomId,
                userId,
                content: '??????',
                fileURL: url,
                fileName: name,
              },
            },
          });
          setIsUploadLoading(false);
        }
      } catch (error) {
        Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_UPLOAD);
      }
    },
    [chatFile, createChat, userId, roomId],
  );
  const onChangeContent = text => {
    setContent(text);
  };
  const onPressCreateChatBtn = () => {
    if (!content) {
      return;
    }
    // scroll ?????? ?????????
    flatlistRef.current.scrollToOffset({offset: 0, animated: false});
    setContent('');
    createChat({
      variables: {
        createChatInput: {
          roomId,
          userId,
          content,
        },
      },
    });
  };
  const onEndReached = () => {
    if (!lazyQueryLoading) {
      getChatList({
        variables: {
          roomId,
          lastId,
          size: PAGE_SIZE,
        },
      });
    }
  };
  const onPressPlusBtn = () => {
    setIsPlusBtnPressed(prev => !prev);
  };
  const onPressCameraBtn = () => {
    launchCamera({}, response => {
      if (response.errorCode) {
        return;
      }
      if (response.didCancel) {
        return;
      }
      setIsUploadLoading(true);
      // scroll ?????? ?????????
      flatlistRef.current.scrollToOffset({offset: 0, animated: false});
      setChatFile(response.assets[0]);
      // Presigned put url??? ?????????.
      const fileExtension = response.assets[0].uri.split('.').pop();
      getPresignedPutURL({
        variables: {
          key: `chat/${roomId}/${new Date().getTime()}.${fileExtension}`,
        },
      });
      setIsPlusBtnPressed(false);
    });
  };
  const onPressImageBtn = () => {
    launchImageLibrary({}, response => {
      if (response.errorCode) {
        return;
      }
      if (response.didCancel) {
        return;
      }
      setIsUploadLoading(true);
      // scroll ?????? ?????????
      flatlistRef.current.scrollToOffset({offset: 0, animated: false});
      setChatFile(response.assets[0]);
      // Presigned put url??? ?????????.
      const fileExtension = response.assets[0].uri.split('.').pop();
      getPresignedPutURL({
        variables: {
          key: `chat/${roomId}/${new Date().getTime()}.${fileExtension}`,
        },
      });
      setIsPlusBtnPressed(false);
    });
  };
  const onPressFileBtn = async () => {
    try {
      const response = await DocumentPicker.pick();
      setIsUploadLoading(true);
      setChatFile(response);
      // Presigned put url??? ?????????.
      const fileExtension = response.name.split('.').pop();
      getPresignedPutURL({
        variables: {
          key: `chat/${roomId}/${new Date().getTime()}.${fileExtension}`,
        },
      });
      setIsPlusBtnPressed(false);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        return;
      } else {
        throw err;
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root}>
      <FlatList
        ref={flatlistRef}
        style={[{backgroundColor: colors.primaryLight}, styles.chatWrapper]}
        data={chatList}
        inverted
        onEndReached={onEndReached}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => <ChatCard chat={item} userId={userId} />}
        ListHeaderComponent={() =>
          lazyQueryLoading2 || isUploadLoading ? (
            <View>
              {imageURL && (
                <Image
                  style={{width: 1, height: 1}}
                  source={{
                    uri: REACT_APP_STORAGE_RESIZED_URL + hashedImageURL,
                  }}
                  onLoad={() => {
                    setIsImageResizing(false);
                  }}
                  onError={() => {
                    setIsImageResizing(true);
                  }}
                />
              )}
              <ChatCardLoading />
            </View>
          ) : null
        }
      />

      <View
        style={[{backgroundColor: colors.custom.white}, styles.inputWrapper]}>
        <IconButton
          style={styles.inputPlusBtn}
          icon={isPlusBtnPressed ? 'close-box' : 'plus-box'}
          color={colors.primary}
          size={20}
          onPress={onPressPlusBtn}
        />
        <TextInput
          value={content}
          style={[{}, styles.inputText]}
          onChangeText={onChangeContent}
          multiline
          numberOfLines={2}
          onFocus={() => {
            // scroll ?????? ?????????
            flatlistRef.current.scrollToOffset({offset: 0, animated: false});
          }}
        />
        <IconButton
          style={styles.inputSendBtn}
          icon="send"
          color={content ? colors.primary : colors.custom.grey}
          size={20}
          onPress={onPressCreateChatBtn}
        />
      </View>
      {isPlusBtnPressed && (
        <View
          style={[{backgroundColor: colors.custom.white}, styles.plusWrapper]}>
          <IconButton
            icon="camera"
            color={colors.custom.red}
            size={30}
            onPress={onPressCameraBtn}
          />
          <IconButton
            icon="image"
            color={colors.custom.orange}
            size={30}
            onPress={onPressImageBtn}
          />
          <IconButton
            icon="attachment"
            color={colors.custom.green}
            size={30}
            onPress={onPressFileBtn}
          />
        </View>
      )}
      {Platform.OS === 'ios' && <KeyboardSpacer />}
    </KeyboardAvoidingView>
  );
};

export const getBlob = async fileUri => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

export default RoomDetail;
