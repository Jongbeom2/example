import {useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {MESSAGE_ERROR, MESSAGE_TITLE} from 'src/res/message';
import {GET_USER} from '../user/user.query';
const OnboardingMain = ({navigation, route}) => {
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
  }, [data, error, authContext]);
  // 유저 정보 로드 실패
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
    <View>
      <Text>온보딩</Text>
      <Button
        onPress={() => {
          authContext.visit();
        }}>
        완료
      </Button>
    </View>
  );
};
export default OnboardingMain;
