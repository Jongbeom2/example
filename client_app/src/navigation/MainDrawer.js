import React, {useContext} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import UserMain from '../page/user/UserMain';
import MainTab from './MainTab';
import {AuthContext} from '../../App';
import {Alert} from 'react-native';
import {MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNOUT} from '../res/message';
const Drawer = createDrawerNavigator();
const MainDrawer = ({route}) => {
  return (
    <Drawer.Navigator
      initialRouteName="tab"
      drawerType="front"
      drawerPosition="left"
      drawerContent={props => <DrawerContent {...props} />}>
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
const DrawerContent = ({...rest}) => {
  const authContext = useContext(AuthContext);
  const onPressSignOutBtn = async () => {
    authContext.signOut();
    Alert.alert(MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNOUT);
  };
  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList {...rest} />
      <DrawerItem label="로그아웃" onPress={onPressSignOutBtn} />
    </DrawerContentScrollView>
  );
};

export default MainDrawer;
