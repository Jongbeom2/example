import React, {useContext} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import UserMain from 'src/page/user/UserMain';
import MainTab from 'src/navigation/MainTab';
import {AuthContext} from 'src/Main';

const Drawer = createDrawerNavigator();
const MainDrawer = ({navigation, route}) => {
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
  const onPressSignOutBtn = async () => {
    authContext.signOut();
  };
  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList {...rest} />
      <DrawerItem label="로그아웃" onPress={onPressSignOutBtn} />
    </DrawerContentScrollView>
  );
};

export default MainDrawer;
