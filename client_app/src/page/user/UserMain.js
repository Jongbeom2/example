import {useQuery} from '@apollo/client';
import React, {useEffect} from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {Button, Title} from 'react-native-paper';
import {AuthContext} from 'src/Main';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {MESSAGE_ERROR, MESSAGE_TITLE} from 'src/res/message';
import {GET_USER} from 'src/page/user/user.query';
import {REACT_APP_STORAGE_URL, REACT_APP_STORAGE_RESIZED_URL} from '@env';
import invalidImage from 'src/res/img/invalid_image.png';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
  },
  nickname: {
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
  },
});
const UserMain = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [sourceIdx, setSourceIdx] = useState(0);
  const sourceList = [
    REACT_APP_STORAGE_RESIZED_URL + user?.profileImageURL,
    REACT_APP_STORAGE_URL + user?.profileImageURL,
    Image.resolveAssetSource(invalidImage).uri,
  ];
  // 유저 정보 로드
  const {data, loading, error} = useQuery(GET_USER, {
    variables: {_id: route.params?.userId},
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
  const onPressEditBtn = () => {
    navigation.navigate('useredit', {
      userId: route.params?.userId,
    });
  };
  const onError = () => {
    setSourceIdx(prev => prev + 1);
  };
  if (!data && loading) {
    return <Loading />;
  }
  return (
    <View style={styles.root}>
      <Image
        style={styles.avatar}
        source={{uri: sourceList[sourceIdx]}}
        onError={onError}
      />
      <Title style={styles.nickname}>{user?.nickname || ''}</Title>
      {route.name === 'my' && (
        <Button mode="contained" onPress={onPressEditBtn}>
          편집
        </Button>
      )}
    </View>
  );
};
export default UserMain;
