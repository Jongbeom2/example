import React, {useContext, useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import UserMain from 'src/page/user/UserMain';
import MainTab from 'src/navigation/MainTab';
import {AuthContext} from 'src/App';
import {Alert} from 'react-native';
import {
  MESSAGE_TITLE,
  MESSAGE_SUCCESS_SIGNOUT,
  MESSAGE_ERROR,
} from '../res/message';
import messaging from '@react-native-firebase/messaging';
import {useMutation} from '@apollo/client';
import {SIGNOUT} from 'src/page/auth/auth.query';
import Loading from 'src/component/Loading';

const Drawer = createDrawerNavigator();
const MainDrawer = ({route}) => {
  return (
    <Drawer.Navigator
      initialRouteName="tab"
      drawerType="front"
      drawerPosition="left"
      drawerContent={props => (
        <DrawerContent userId={route?.params?.userId} {...props} />
      )}>
      <Drawer.Screen
        name="tab"
        options={{title: '메인'}}
        component={MainTab}
        initialParams={{userId: route?.params?.userId}}
      />
      <Drawer.Screen
        name="my"
        options={{title: '내정보'}}
        component={UserMain}
        initialParams={{userId: route?.params?.userId}}
      />
    </Drawer.Navigator>
  );
};
const DrawerContent = ({userId, ...rest}) => {
  const authContext = useContext(AuthContext);
  // 로그아웃
  const [
    signOut,
    {loading: mutationLoading, error: mutationError, data: mutationData},
  ] = useMutation(SIGNOUT);
  // 로그 아웃 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      (async () => {
        authContext.signOut();
        Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNOUT);
      })();
    }
  }, [mutationData, mutationError, authContext]);
  // 로그 아웃 실패
  useEffect(() => {
    if (mutationError) {
      Alert.alert(MESSAGE_TITLE, MESSAGE_ERROR);
    }
  }, [mutationError]);

  const onPressSignOutBtn = async () => {
    const fcmToken = await messaging().getToken();
    signOut({
      variables: {
        signOutInput: {
          _id: userId,
          fcmToken,
        },
      },
    });
  };
  if (mutationLoading) {
    return <Loading />;
  }
  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList {...rest} />
      <DrawerItem label="로그아웃" onPress={onPressSignOutBtn} />
    </DrawerContentScrollView>
  );
};

export default MainDrawer;
