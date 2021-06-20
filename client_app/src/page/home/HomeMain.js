import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GET_USER_LIST } from './home.query';
import { isNotAuthorizedError } from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_TITLE,
} from 'src/res/message';
import { AuthContext } from 'src/Main';
import UserCard from 'src/page/home/UserCard';
import Loading from 'src/component/Loading';
const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});
const HomeMain = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const userId = route.params?.userId;
  const [userList, setUserList] = useState([]);
  // 유저 리스트 로드
  const { data, loading, error } = useQuery(GET_USER_LIST, {
    variables: {
      _id: userId,
    },
    fetchPolicy: 'cache-and-network',
  });
  // 유저 리스트 로드 성공
  useEffect(() => {
    if (data && !error) {
      setUserList(data.getUserList);
    }
  }, [data, error]);
  // 유저 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  if (!data && loading) {
    return <Loading />;
  }
  return (
    <View style={styles.root}>
      <ScrollView>
        {userList.map(user => (
          <UserCard key={user._id} user={user} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
};
export default HomeMain;
