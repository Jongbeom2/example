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
  const {signOut} = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList {...rest} />
      <DrawerItem
        label="로그아웃"
        onPress={() => {
          signOut();
        }}
      />
    </DrawerContentScrollView>
  );
};

export default MainDrawer;
