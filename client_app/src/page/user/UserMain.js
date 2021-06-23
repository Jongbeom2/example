import {useQuery} from '@apollo/client';
import React, {useEffect} from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {Avatar, Button, Text, Title} from 'react-native-paper';
import {AuthContext} from 'src/Main';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_TITLE,
} from 'src/res/message';
import {GET_USER} from 'src/page/user/user.query';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginBottom: 10,
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
  if (!data && loading) {
    return <Loading />;
  }
  return (
    <View style={styles.root}>
      <Avatar.Image
        size={100}
        style={styles.avatar}
        label="A"
        source={{uri: user?.profileImageURL}}
      />
      <Title style={styles.nickname}>{user?.nickname || ''}</Title>
      <Text style={styles.text}>게시물 0</Text>
      <Text style={styles.text}>참여중인 대화방 0 </Text>
      {route.name === 'my' && (
        <Button mode="contained" onPress={onPressEditBtn}>
          편집
        </Button>
      )}
    </View>
  );
};
export default UserMain;
