import {useQuery} from '@apollo/client';
import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {Text} from 'react-native-paper';
import Loading from 'src/component/Loading';
import {isNotAuthorizedError} from 'src/lib/error';
import {AuthContext} from 'src/Main';
import {MESSAGE_ERROR, MESSAGE_TITLE} from 'src/res/message';
import {GET_ROOM_LIST} from '../room/room.query';
import {GET_USER} from '../user/user.query';
import OnboardingPolicy from './OnboardingPolicy';
import OnboardingNickname from './OnboardingNickname';
import OnboardingRoom from './OnboardingRoom';
const OnboardingMain = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const userId = route.params?.userId;
  const [step, setStep] = useState(0);
  const [roomList, setRoomList] = useState([]);
  // 대화방 로드
  const {data, loading, error} = useQuery(GET_ROOM_LIST, {variables: {userId}});
  // 대화방 로드 성공
  useEffect(() => {
    if (data && !error) {
      setRoomList(data.getRoomList);
    }
  }, [data, error]);
  // 대화방 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      authContext.signOut();
    } else if (error) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [error, authContext]);
  // Stepper
  let content;
  switch (step) {
    case 0:
      content = (
        <OnboardingPolicy
          onPressConfirmBtn={() => {
            setStep(1);
          }}
        />
      );
      break;
    case 1:
      content = (
        <OnboardingNickname
          userId={userId}
          onPressConfirmBtn={() => {
            setStep(2);
          }}
        />
      );
      break;
    case 2:
      content = <OnboardingRoom userId={userId} roomList={roomList} />;
      break;
    default:
      content = (
        <OnboardingPolicy
          onPressConfirmBtn={() => {
            setStep(1);
          }}
        />
      );
      break;
  }
  if (!data && loading) {
    return <Loading />;
  }
  return content;
};
export default OnboardingMain;
