import {useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import {GET_USER_LIST} from './home.query';
import {isNotAuthorizedError} from '../../lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_TITLE,
} from '../../res/message';
import {AuthContext} from '../../../App';
import UserCard from './UserCard';
import Loading from '../../component/Loading';
const HomeMain = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const [userList, setUserList] = useState([]);
  // 유저 리스트 로드
  const {data, loading, error} = useQuery(GET_USER_LIST, {
    variables: {
      _id: route.params?.userId,
    },
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
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_AUTH);
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  if (loading) {
    return <Loading />;
  }
  return (
    <ScrollView>
      {userList.map(user => (
        <UserCard key={user._id} user={user} navigation={navigation} />
      ))}
    </ScrollView>
  );
};
export default HomeMain;
