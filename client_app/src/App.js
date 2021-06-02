import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useMemo, useReducer} from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// 아이콘 패키지 : https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignIn from 'src/page/auth/SignIn.js';
import MainDrawer from 'src/navigation/MainDrawer.js';
import {ApolloProvider} from '@apollo/client';
import client from 'src/apollo/client';
// Material UI 패키지 : https://callstack.github.io/react-native-paper/index.html
import {
  DefaultTheme,
  Provider as PaperProvider,
  Text,
} from 'react-native-paper';
import SignUp from 'src/page/auth/SignUp.js';
import Loading from 'src/page/loading/Loading.js';
import SplashScreen from 'react-native-splash-screen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import UserMain from 'src/page/user/UserMain.js';
import UserEdit from 'src/page/user/UserEdit.js';
import RoomDetail from 'src/page/room/RoomDetail.js';
import {MESSAGE_TITLE} from 'src/res/message';
// import {MESSAGE_TITLE} from 'src/res/message';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3379fe',
    primaryDrak: '#2354b1',
    primaryLight: '#deebff',
    custom: {
      textPrimary: '#222222',
      textSecondary: '#666666',
      kakao: '#f9e000',
      naver: '#04cf5c',
      google: '#4f8df5',
      white: '#ffffff',
      red: '#eb4d4b',
      orange: '#f0932b',
      grey: '#666666',
      green: '#6ab04c',
      yellow: '#f9e000',
    },
  },
};
const Stack = createStackNavigator();
export const AuthContext = createContext();
const App = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoading: false,
            isSignIn: true,
            userId: action.userId,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoading: false,
            isSignIn: false,
            userId: null,
          };
      }
    },
    {
      isLoading: true,
      isSignIn: false,
      userId: null,
    },
  );
  useEffect(() => {
    // permission
    (async () => {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
        {
          title: MESSAGE_TITLE,
          message: '다음의 권한을 허용하시겠습니까',
          buttonNeutral: '다음에 묻기',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('권한 허용');
      } else {
        console.log('권한 허용 실패');
      }
    })();
    // userId
    (async () => {
      let userId;
      try {
        userId = await AsyncStorage.getItem('userId');
      } catch (e) {
        // Restoring token failed
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      if (userId) {
        dispatch({type: 'SIGN_IN', userId});
      } else {
        dispatch({type: 'SIGN_OUT'});
      }
      SplashScreen.hide();
    })();
  }, []);
  const authContext = useMemo(
    () => ({
      signIn: async userId => {
        await AsyncStorage.setItem('userId', userId);
        dispatch({type: 'SIGN_IN', userId});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userId');
        dispatch({type: 'SIGN_OUT'});
      },
    }),
    [],
  );
  /*
    Navigation 구조
    - Stack.Navigator
      - Drawer.Navigator
        - Tab.Navigator
          - Tab.Screen(home)
          - Tab.Screen(room)
          - Tab.Screen(feed)
        - Drawer.Screen(my)
      - Stack.Screen(user)
      - Stack.Screen(useredit)
      - Stack.Screen(chat)
  */
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator>
              {state.isLoading === true && (
                <Stack.Screen
                  name="loading"
                  component={Loading}
                  options={{headerShown: false}}
                />
              )}
              {state.isSignIn === false ? (
                <>
                  <Stack.Screen
                    name="signin"
                    component={SignIn}
                    options={{title: '로그인'}}
                  />
                  <Stack.Screen
                    name="signup"
                    component={SignUp}
                    options={{title: '회원가입'}}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="drawer"
                    component={MainDrawer}
                    options={({route}) => ({
                      headerTitle: getHeaderTitle(route),
                      headerRight: HeaderRight,
                    })}
                    initialParams={{userId: state.userId}}
                  />
                  <Stack.Screen
                    name="user"
                    component={UserMain}
                    options={{title: '유저'}}
                  />
                  <Stack.Screen
                    name="useredit"
                    component={UserEdit}
                    options={{title: '내정보'}}
                  />
                  <Stack.Screen
                    name="roomdetail"
                    component={RoomDetail}
                    options={{title: '대화방'}}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  iconMenu: {
    marginRight: 10,
  },
});

const HeaderRight = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Ionicons name="menu" size={20} style={styles.iconMenu} />
      </TouchableOpacity>
    </View>
  );
};

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route);
  switch (routeName) {
    case 'my':
      return '내정보';
    case 'tab':
      return '메인';
    default:
      return '메인';
  }
}

export default App;
