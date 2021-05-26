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
const HomeMain = () => {
  const {state, dispatch} = useContext(AuthContext);
  const userId = state.userId;
  const {data, loading, error} = useQuery(GET_USER_LIST, {
    variables: {
      _id: userId,
    },
  });
  const [userList, setUserList] = useState([]);
  // 유저 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setUserList(data.getUserList);
    }
  }, [data, error]);
  // 유저 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR_AUTH);
      dispatch({type: 'SIGN_OUT'});
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, dispatch]);
  return (
    <ScrollView>
      {userList.map(user => (
        <UserCard key={user._id} user={user} />
      ))}
    </ScrollView>
  );
};
export default HomeMain;
