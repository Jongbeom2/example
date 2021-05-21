import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeMain from '../page/home/HomeMain';
import RoomMain from '../page/room/RoomMain';
import FeedMain from '../page/feed/FeedMain';
// https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();
const MainTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'grey',
      }}
      screenOptions={({route}) => ({
        tabBarLabel: route.name,
        tabBarIcon: ({focused}) => TabBarIcon(focused, route?.name),
      })}>
      <Tab.Screen
        name="home"
        options={{tabBarLabel: '홈'}}
        component={HomeMain}
      />
      <Tab.Screen
        name="room"
        options={{tabBarLabel: '대화방'}}
        component={RoomMain}
      />
      <Tab.Screen
        name="feed"
        options={{tabBarLabel: '피드'}}
        component={FeedMain}
      />
    </Tab.Navigator>
  );
};
const TabBarIcon = (focused, name) => {
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
      color={focused ? 'blue' : 'grey'}
    />
  );
};

export default MainTab;
