import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  IconButton,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {AuthContext} from 'src/Main';
import {isNotAuthorizedError} from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_UPLOAD,
  MESSAGE_SUCCESS_UPDATE_USER,
  MESSAGE_TITLE,
} from 'src/res/message';
import {GET_USER, UPDATE_USER} from 'src/page/user/user.query';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {GET_PRESIGNED_PUT_URL} from 'src/lib/file.query';
import Loading from 'src/component/Loading';
import {REACT_APP_STORAGE_URL, REACT_APP_STORAGE_RESIZED_URL} from '@env';
import invalidImage from 'src/res/img/invalid_image.png';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCamera: {
    right: -20,
    top: -20,
    position: 'absolute',
  },
  iconImage: {
    right: -20,
    bottom: 0,
    position: 'absolute',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 20,
    width: 300,
    height: 50,
  },
  btn: {
    marginBottom: 20,
    width: 300,
  },
});
const UserEdit = ({route, navigation}) => {
  const userId = route.params?.userId;
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [sourceIdx, setSourceIdx] = useState(0);
  const sourceList = [
    REACT_APP_STORAGE_RESIZED_URL + user?.profileImageURL,
    REACT_APP_STORAGE_URL + user?.profileImageURL,
    Image.resolveAssetSource(invalidImage).uri,
  ];
  // 유저 정보 로드
  const {data, loading, error} = useQuery(GET_USER, {
    variables: {_id: userId},
    fetchPolicy: 'cache-and-network',
  });
  // 유저 정보 로드 성공
  useEffect(() => {
    if (data && !error) {
      setUser(data.getUser);
    }
  }, [data, error]);
  // 유저 정보 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  const onChangeNickname = text => {
    setUser({...user, nickname: text});
  };
  // presigned url 로드
  const [
    getPresignedPutURL,
    {data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError},
  ] = useLazyQuery(GET_PRESIGNED_PUT_URL);
  // presigned url 로드 성공
  useEffect(() => {
    if (lazyQueryData && !lazyQueryError) {
      const presignedURL = lazyQueryData.getPresignedPutURL.presignedURL;
      (async function () {
        try {
          const file = await getBlob(imageFile.uri);
          const result = await fetch(presignedURL, {
            method: 'PUT',
            body: file,
          });
          const url = result.url
            .split('?')[0]
            .replace(REACT_APP_STORAGE_URL, '');
          setUser(preUser => ({
            ...preUser,
            profileImageURL: url,
          }));
          setIsImageLoading(false);
        } catch (e) {
          console.log(e);
          Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_UPLOAD);
        }
      })();
    }
  }, [lazyQueryData, lazyQueryError, imageFile]);
  // presigned url 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError)) {
      authContext.signOut();
    } else if (lazyQueryError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [lazyQueryError, authContext]);
  // 유저 정보 업데이트
  const [
    updateUser,
    {data: mutationData, loading: mutaionLoading, error: mutationError},
  ] = useMutation(UPDATE_USER);
  // 유저 정보 수정 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_UPDATE_USER);
      navigation.goBack();
    }
  }, [mutationData, mutationError, navigation]);
  // 유저 정보 수정 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      authContext.signOut();
    } else if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError, authContext]);
  const onPressEditBtn = () => {
    updateUser({
      variables: {
        updateUserInput: {
          _id: user._id,
          nickname: user.nickname,
          profileImageURL: user.profileImageURL,
        },
      },
    });
  };
  const onPressCancelBtn = () => {
    navigation.goBack();
  };
  const onPressDeleteBtn = () => {
    setUser({...user, profileImageURL: ''});
  };
  const onPressCameraBtn = () => {
    launchCamera({}, response => {
      setIsImageLoading(true);
      if (response.errorCode) {
        console.log(response.errorCode);
        return;
      }
      if (response.didCancel) {
        return;
      }
      setImageFile(response.assets[0]);
      // Presigned put url을 가져옴.
      const fileExtension = response.assets[0].uri.split('.').pop();
      getPresignedPutURL({
        variables: {
          key: `profile/${userId}/${new Date().getTime()}.${fileExtension}`,
        },
      });
    });
  };
  const onPressImageBtn = () => {
    launchImageLibrary({}, response => {
      setIsImageLoading(true);
      if (response.didCancel) {
        return;
      }
      setImageFile(response.assets[0]);
      // Presigned put url을 가져옴.
      const fileExtension = response.assets[0].uri.split('.').pop();
      getPresignedPutURL({
        variables: {
          key: `profile/${userId}/${new Date().getTime()}.${fileExtension}`,
        },
      });
    });
  };
  const onError = () => {
    setSourceIdx(prev => prev + 1);
  };
  if (mutaionLoading) {
    return <Loading />;
  }
  if (loading) {
    return <Loading />;
  }
  if (lazyQueryLoading) {
    return <Loading />;
  }
  if (isImageLoading) {
    return <Loading />;
  }
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View>
        {user?.profileImageURL ? (
          <>
            <Image
              style={styles.avatar}
              source={{uri: sourceList[sourceIdx]}}
              onError={onError}
            />
            <IconButton
              style={styles.iconCamera}
              icon="close-circle-outline"
              color={theme.colors.custom.grey}
              size={30}
              onPress={onPressDeleteBtn}
            />
          </>
        ) : (
          <>
            <Avatar.Image size={100} style={styles.avatar} label="A" />
            <IconButton
              style={styles.iconCamera}
              icon="camera"
              color={theme.colors.custom.grey}
              size={30}
              onPress={onPressCameraBtn}
            />
            <IconButton
              style={styles.iconImage}
              icon="image"
              color={theme.colors.custom.grey}
              size={30}
              onPress={onPressImageBtn}
            />
          </>
        )}
      </View>
      <TextInput
        style={styles.textInput}
        label="닉네임"
        mode="outlined"
        value={user?.nickname}
        onChangeText={onChangeNickname}
      />
      <Button style={styles.btn} mode="contained" onPress={onPressEditBtn}>
        확인
      </Button>
      <Button style={styles.btn} onPress={onPressCancelBtn}>
        취소
      </Button>
    </KeyboardAvoidingView>
  );
};

export const getBlob = async fileUri => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

export default UserEdit;
