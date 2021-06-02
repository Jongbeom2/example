import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'react-native-paper';
import HomeMain from 'src/page/home/HomeMain';
import RoomMain from 'src/page/room/RoomMain';
import FeedMain from 'src/page/feed/FeedMain';
const Tab = createBottomTabNavigator();
const MainTab = ({route: parentRoute}) => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.custom.grey,
      }}
      screenOptions={({route}) => ({
        tabBarLabel: route.name,
        tabBarIcon: ({focused}) =>
          TabBarIcon(focused, route?.name, theme.colors),
      })}>
      <Tab.Screen
        name="home"
        options={{tabBarLabel: '홈'}}
        component={HomeMain}
        initialParams={{userId: parentRoute?.params?.userId}}
      />
      <Tab.Screen
        name="room"
        options={{tabBarLabel: '대화방'}}
        component={RoomMain}
        initialParams={{userId: parentRoute?.params?.userId}}
      />
      <Tab.Screen
        name="feed"
        options={{tabBarLabel: '피드'}}
        component={FeedMain}
        initialParams={{userId: parentRoute?.params?.userId}}
      />
    </Tab.Navigator>
  );
};
const TabBarIcon = (focused, name, colors) => {
  let iconName = 'home';
  if (name === 'home') {
    iconName = 'home';
  } else if (name === 'room') {
    iconName = 'chatbox';
  } else if (name === 'feed') {
    iconName = 'ios-images-sharp';
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
