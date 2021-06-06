import React, {useContext, useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {AuthContext} from 'src/Main';
import RoomDetail from 'src/page/room/RoomDetail';
import {
  GET_MY_ROOM_LIST,
  UPDATE_USER_REMOVE_ROOM,
} from 'src/page/room/room.query';
import {useMutation} from '@apollo/client';
import produce from 'immer';
import {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS_UPDATE_USER_REMOVE_ROOM,
  MESSAGE_TITLE,
} from 'src/res/message';
import {Alert} from 'react-native';
import {isNotAuthorizedError} from 'src/lib/error';
import Loading from 'src/component/Loading';
import {DrawerActions} from '@react-navigation/routers';

const Drawer = createDrawerNavigator();
const RoomDetailDrawer = ({route, navigation}) => {
  const roomId = route?.params?.roomId;
  const userId = route?.params?.userId;
  const authContext = useContext(AuthContext);
  // 대화방 나가기
  const [
    updateUserRemoveRoom,
    {data: mutationData2, loading: mutationLoading2, error: mutationError2},
  ] = useMutation(UPDATE_USER_REMOVE_ROOM, {
    update(cache, {data: mutationData2Result}) {
      const removedRoom = mutationData2Result.updateUserRemoveRoom;
      const existingRoomList = cache.readQuery({
        query: GET_MY_ROOM_LIST,
        variables: {
          userId,
        },
      }).getMyRoomList;
      if (removedRoom && existingRoomList) {
        cache.writeQuery({
          query: GET_MY_ROOM_LIST,
          variables: {
            userId,
          },
          data: {
            getMyRoomList: produce(existingRoomList, draft => {
              return draft.filter(room => room._id !== removedRoom._id);
            }),
          },
        });
      }
    },
  });
  // 대화방 나가기 성공
  useEffect(() => {
    if (mutationData2 && !mutationError2) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_UPDATE_USER_REMOVE_ROOM);
      navigation.goBack();
    }
  }, [mutationData2, mutationError2, navigation]);
  // 대화방 나가기 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError2)) {
      authContext.signOut();
    } else if (mutationError2) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError2, authContext]);
  const onPressLeaveRoomBtn = async () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    updateUserRemoveRoom({
      variables: {
        updateUserRemoveRoomInput: {
          userId,
          roomId,
        },
      },
    });
  };
  return (
    <Drawer.Navigator
      initialRouteName={'roomdetail'}
      drawerType="front"
      drawerPosition="right"
      drawerContent={props => (
        <DrawerContent
          userId={userId}
          onPressLeaveRoomBtn={onPressLeaveRoomBtn}
          {...props}
        />
      )}>
      {mutationLoading2 ? (
        <Drawer.Screen name={'roomdetailloading'} component={Loading} />
      ) : (
        <Drawer.Screen
          name={'roomdetail'}
          options={{title: '대화방'}}
          component={RoomDetail}
          initialParams={{userId, roomId}}
        />
      )}
    </Drawer.Navigator>
  );
};
const DrawerContent = ({userId, onPressLeaveRoomBtn, ...rest}) => {
  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList {...rest} />
      <DrawerItem label="나가기" onPress={onPressLeaveRoomBtn} />
    </DrawerContentScrollView>
  );
};

export default RoomDetailDrawer;
