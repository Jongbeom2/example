import {useLazyQuery, useMutation, useSubscription} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {CHAT_CREATED, CREATE_CHAT, GET_CHAT_LIST} from './room.query';
import {
  isNotAuthorizedError,
  isNotAuthorizedErrorSubscription,
} from '../../lib/error';
import {MESSAGE_ERROR, MESSAGE_ERROR_AUTH} from '../../res/message';
import ChatCard from './ChatCard';

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
});
const RoomDetail = ({route}) => {
  const PAGE_SIZE = 30;
  const userId = route?.params?.userId;
  const roomId = route?.params.roomId;
  const {colors} = useTheme();
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  const [page, setPage] = useState(0);
  const [isPlusBtnPressed, setIsPlusBtnPressed] = useState(false);
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
  }, [subscriptionData, subscriptionError]);
  // 대화 구독 실패
  useEffect(() => {
    if (isNotAuthorizedErrorSubscription(subscriptionError)) {
      alert(MESSAGE_ERROR_AUTH);
    } else if (subscriptionError) {
      alert(MESSAGE_ERROR);
    }
  }, [subscriptionError]);
  // 2. 대화 로드
  const [
    getChatList,
    {data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError},
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
      setPage(prevPage => prevPage + 1);
    }
  }, [lazyQueryData, lazyQueryError, setChatList, setPage]);
  // 대화 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError)) {
      Alert.alert(MESSAGE_ERROR_AUTH);
    } else if (lazyQueryError) {
      Alert.alert(MESSAGE_ERROR);
    }
  }, [lazyQueryError]);
  // 3. 대화 생성
  const [
    createChat,
    {data: mutationData, loading: mutationLoading, error: mutationError},
  ] = useMutation(CREATE_CHAT);
  // 대화 생성 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      Alert.alert(MESSAGE_ERROR_AUTH);
    } else if (mutationError) {
      Alert.alert(MESSAGE_ERROR);
    }
  }, [mutationError]);
  const onChangeContent = text => {
    setContent(text);
  };
  const onPressCreateChatBtn = () => {
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
  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        style={[{backgroundColor: colors.primaryLight}, styles.chatWrapper]}
        data={chatList}
        inverted
        onEndReached={onEndReached}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => <ChatCard chat={item} userId={userId} />}
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
            onPress={() => {}}
          />
          <IconButton
            icon="image"
            color={colors.custom.orange}
            size={30}
            onPress={() => {}}
          />
          <IconButton
            icon="attachment"
            color={colors.custom.green}
            size={30}
            onPress={() => {}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
export default RoomDetail;
