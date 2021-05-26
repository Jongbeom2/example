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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {MESSAGE_TITLE, MESSAGE_SUCCESS_SIGNOUT} from '../res/message';
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="tab"
      drawerType="front"
      drawerPosition="left"
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="tab" options={{title: '메인'}} component={MainTab} />
      <Drawer.Screen
        name="user"
        options={{title: '내정보'}}
        component={UserMain}
      />
    </Drawer.Navigator>
  );
};
const DrawerContent = ({...rest}) => {
  const {dispatch} = useContext(AuthContext);
  const onPressSignOutBtn = async () => {
    await AsyncStorage.removeItem('userId');
    dispatch({type: 'SIGN_OUT'});
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
