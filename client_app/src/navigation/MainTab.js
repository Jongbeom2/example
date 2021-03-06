import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'react-native-paper';
import UserListMain from 'src/page/uesrlist/UserListMain';
import RoomMain from 'src/page/room/RoomMain';
import RestaurantMain from 'src/page/restaurant/RestaurantMain';
import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();
const MainTab = ({navigation, route: parentRoute}) => {
  const userId = parentRoute.params?.userId;
  const theme = useTheme();
  useEffect(() => {
    // 앱 사용 상태일 때 메세지 도착
    messaging().onMessage(remoteMessage => {});
    // 앱 백그라운드 상태일 때 메세지 도착
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        if ((remoteMessage.data.type = 'chat')) {
          navigation.navigate('room', {
            roomId: remoteMessage.data.roomId,
            userId,
          });
          navigation.navigate('roomdetaildrawer', {
            roomId: remoteMessage.data.roomId,
            userId,
          });
        }
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
      }
    });
    // 앱 끈 상태일 때 메세지 도착
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          if ((remoteMessage.data.type = 'chat')) {
            navigation.navigate('room', {
              roomId: remoteMessage.data.roomId,
              userId,
            });
            navigation.navigate('roomdetaildrawer', {
              roomId: remoteMessage.data.roomId,
              userId,
            });
          }
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      });
  }, [navigation, userId]);
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.custom.grey,
        style: {
          height: 48.8,
        },
        tabStyle: {
          height: 48.8,
        },
      }}
      screenOptions={({route}) => ({
        tabBarLabel: route.name,
        tabBarIcon: ({focused}) =>
          TabBarIcon(focused, route?.name, theme.colors),
      })}>
      <Tab.Screen
        name="home"
        options={{tabBarLabel: '대화방'}}
        component={RoomMain}
        initialParams={{userId: parentRoute?.params?.userId}}
      />
      <Tab.Screen
        name="userlist"
        options={{tabBarLabel: '함께하는 맘들'}}
        component={UserListMain}
        initialParams={{userId: parentRoute?.params?.userId}}
      />
      {/* <Tab.Screen
        name="restaurant"
        options={{tabBarLabel: '맛집'}}
        component={RestaurantMain}
        initialParams={{userId: parentRoute?.params?.userId}}
      /> */}
    </Tab.Navigator>
  );
};
const TabBarIcon = (focused, name, colors) => {
  let iconName = 'userlist';
  if (name === 'home') {
    iconName = 'home';
  } else if (name === 'userlist') {
    iconName = 'people';
  } else if (name === 'restaurant') {
    iconName = 'restaurant';
  }
  const iconSize = 20;
  return (
    <Ionicons
      name={iconName}
      size={iconSize}
      color={focused ? colors.primary : colors.custom.grey}
    />
  );
};

export default MainTab;
