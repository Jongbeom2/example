import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Alert,
  FlatList,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GET_PRESIGNED_PUT_URL } from 'src/lib/file.query';
import DocumentPicker from 'react-native-document-picker';
import { AuthContext } from 'src/Main';
import ChatCardLoading from './ChatCardLoading';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
const RoomDetail = ({ route, navigation }) => {
  const PAGE_SIZE = 15;
  const roomId = route?.params.roomId;
  const userId = route?.params?.userId;
  const { colors } = useTheme();
  const authContext = useContext(AuthContext);
  let flatlistRef = useRef();
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  const [chatFile, setChatFile] = useState(null);
  const [isPlusBtnPressed, setIsPlusBtnPressed] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  // 1. 대화 구독
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(CHAT_CREATED, {
    variables: {
      roomId,
    },
  });
  // 대화 구독 성공
  useEffect(() => {
    if (subscriptionData && !subscriptionError) {
      setChatList(preChatList => [
        subscriptionData.chatCreated,
        ...preChatList,
      ]);
    }
    return () => { };
  }, [subscriptionData, subscriptionError]);
  // 대화 구독 실패
  useEffect(() => {
    if (isNotAuthorizedErrorSubscription(subscriptionError)) {
      authContext.signOut();
    } else if (subscriptionError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [subscriptionError, authContext]);
  // 2. 대화 로드
  const [
    getChatList,
    { data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError },
  ] = useLazyQuery(GET_CHAT_LIST);
  useEffect(() => {
    getChatList({
      variables: {
        roomId,
        skip: 0,
        size: PAGE_SIZE,
      },
    });
  }, [getChatList, roomId]);
  // 대화 로드 성공
  useEffect(() => {
    if (lazyQueryData && !lazyQueryError) {
      setChatList(preChatList => [
        ...preChatList,
        ...lazyQueryData.getChatList,
      ]);
    }
  }, [lazyQueryData, lazyQueryError, setChatList]);
  // 대화 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError)) {
      authContext.signOut();
    } else if (lazyQueryError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [lazyQueryError, authContext]);
  // 3. 대화 생성
  const [
    createChat,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_CHAT);
  // 대화 생성 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      authContext.signOut();
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError, authContext]);
  // 4. presigned url 로드
  const [
    getPresignedPutURL,
    { data: lazyQueryData2, loading: lazyQueryLoading2, error: lazyQueryError2 },
  ] = useLazyQuery(GET_PRESIGNED_PUT_URL);
  // presigned url 로드 성공
  useEffect(() => {
    if (lazyQueryData2 && !lazyQueryError2) {
      const presignedURL = lazyQueryData2.getPresignedPutURL.presignedURL;
      uplaodFile(presignedURL);
    }
  }, [lazyQueryData2, lazyQueryError2, uplaodFile]);
  // presigned url 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError2)) {
      authContext.signOut();
    } else if (lazyQueryError2) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [lazyQueryError2, authContext]);
  // 5. 파일 업로드
  const uplaodFile = useCallback(
    async presignedURL => {
      try {
        // Presigned put url을 이용하여 업로드
        const file = await getBlob(chatFile.uri);
        const result = await fetch(presignedURL, {
          method: 'PUT',
          body: file,
        });
        const url = result.url.split('?')[0];
        const type = file.data.type.split('/')[0];
        const name = file.data.name;
        if (type === 'image') {
          createChat({
            variables: {
              createChatInput: {
                roomId,
                userId,
                content: '사진',
                imageURL: url,
                thumbnailImageURL: url.replace(
                  'example-jb',
                  'example-jb-thumbnail',
                ),
              },
            },
          });
        } else {
          createChat({
            variables: {
              createChatInput: {
                roomId,
                userId,
                content: '파일',
                fileURL: url,
                fileName: name,
              },
            },
          });
        }
        setIsUploadLoading(false);
      } catch (error) {
        console.log(error);
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
    // scroll 제일 밑으로
    flatlistRef.current.scrollToOffset({ offset: 0, animated: false });
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
    getChatList({
      variables: {
        roomId,
        skip: chatList.length,
        size: PAGE_SIZE,
      },
    });
  };
  const onPressPlusBtn = () => {
    setIsPlusBtnPressed(prev => !prev);
  };
  const onPressCameraBtn = () => {
    launchCamera({}, response => {
      if (response.errorCode) {
        console.log(response.errorCode);
        return;
      }
      if (response.didCancel) {
        return;
      }
      setIsUploadLoading(true);
      // scroll 제일 밑으로
      flatlistRef.current.scrollToOffset({ offset: 0, animated: false });
      setChatFile(response.assets[0]);
      // Presigned put url을 가져옴.
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
      if (response.didCancel) {
        return;
      }
      setIsUploadLoading(true);
      // scroll 제일 밑으로
      flatlistRef.current.scrollToOffset({ offset: 0, animated: false });
      setChatFile(response.assets[0]);
      // Presigned put url을 가져옴.
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
      // Presigned put url을 가져옴.
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
    <KeyboardAvoidingView style={styles.root} >
      <FlatList
        ref={flatlistRef}
        style={[{ backgroundColor: colors.primaryLight }, styles.chatWrapper]}
        data={chatList}
        inverted
        onEndReached={onEndReached}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => <ChatCard chat={item} userId={userId} />}
        ListHeaderComponent={() =>
          lazyQueryLoading2 || isUploadLoading ? <ChatCardLoading /> : null
        }
      />
      <View
        style={[{ backgroundColor: colors.custom.white }, styles.inputWrapper]}>
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
            // scroll 제일 밑으로
            flatlistRef.current.scrollToOffset({ offset: 0, animated: false });
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
          style={[{ backgroundColor: colors.custom.white }, styles.plusWrapper]}>
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
      <KeyboardSpacer />
    </KeyboardAvoidingView>
  );
};

export const getBlob = async fileUri => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

export default RoomDetail;
