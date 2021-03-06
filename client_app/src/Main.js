import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useMemo, useReducer} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
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
import {useMutation} from '@apollo/client';
// Material UI 패키지 : https://callstack.github.io/react-native-paper/index.html
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SignUp from 'src/page/auth/SignUp.js';
import Loading from 'src/page/loading/Loading.js';
import SplashScreen from 'react-native-splash-screen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import UserMain from 'src/page/user/UserMain.js';
import UserEdit from 'src/page/user/UserEdit.js';
import {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS_SIGNOUT,
  MESSAGE_TITLE,
} from 'src/res/message';
import messaging from '@react-native-firebase/messaging';
import {SIGNOUT} from './page/auth/auth.query';
import RoomDetailDrawer from './navigation/RoomDetailDrawer';
import RestaurantDetail from './page/restaurant/RestaurantDetail';
import OnboardingMain from './page/onboarding/OnboardingMain';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#92685d',
    primaryDrak: '#4a332b',
    primaryLight: '#e2d3cd',
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
      greyLight: '#eeeeee',
      green: '#6ab04c',
      yellow: '#f9e000',
    },
  },
};
const Stack = createStackNavigator();
export const AuthContext = createContext();
const Main = props => {
  const navigation = props.navigation;
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoading: false,
            isSignIn: true,
            userId: action.userId,
            isVisted: action.isVisted,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoading: false,
            isSignIn: false,
            userId: null,
          };
        case 'VISIT':
          return {
            ...prevState,
            isVisted: true,
          };
      }
    },
    {
      isLoading: true,
      isSignIn: false,
      userId: null,
      isVisted: false,
    },
  );
  // 1. 로그아웃
  const [
    signOut,
    {loading: mutationLoading, error: mutationError, data: mutationData},
  ] = useMutation(SIGNOUT);
  // 로그 아웃 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      (async () => {
        await AsyncStorage.removeItem('userId');
        dispatch({type: 'SIGN_OUT'});
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
  // 2. 초기화
  useEffect(() => {
    if (Platform.OS === 'android') {
      // device permission
      (async () => {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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
          console.log('안드로이드 Device 권한 허용');
        } else {
          console.log(' 안드로이드 Device 권한 허용 실패');
        }
      })();
    } else {
      //  firebase permission
      (async () => {
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus) {
          console.log(
            'IOS Firebase 권한 허용, Permission status:',
            authorizationStatus,
          );
        }
      })();
    }
    (async () => {
      const userId = await AsyncStorage.getItem('userId');
      const isVisted = await AsyncStorage.getItem('isVisted');
      if (userId) {
        dispatch({type: 'SIGN_IN', userId, isVisted: JSON.parse(isVisted)});
      } else {
        dispatch({type: 'SIGN_OUT'});
      }
    })();
    // hide splash screen
    SplashScreen.hide();
  }, [navigation]);
  // 3. authContext
  const authContext = useMemo(
    () => ({
      signIn: async (userId, isVisted) => {
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('isVisted', isVisted.toString());
        dispatch({type: 'SIGN_IN', userId, isVisted});
      },
      signOut: async () => {
        const userId = await AsyncStorage.getItem('userId');
        const fcmToken = await messaging().getToken();
        signOut({
          variables: {
            signOutInput: {
              _id: userId,
              fcmToken,
            },
          },
        });
      },
      visit: async () => {
        await AsyncStorage.setItem('isVisted', 'true');
        dispatch({type: 'VISIT'});
      },
    }),
    [signOut],
  );
  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={{flex: 1}}>
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
              ) : state.isVisted === false ? (
                <Stack.Screen
                  name="시작하기"
                  component={OnboardingMain}
                  initialParams={{userId: state.userId}}
                />
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
                    name="roomdetaildrawer"
                    component={RoomDetailDrawer}
                    options={({route}) => ({
                      headerTitle: getHeaderTitle(route),
                      headerRight: HeaderRight,
                    })}
                  />
                  <Stack.Screen
                    name="restaurantdetail"
                    component={RestaurantDetail}
                    options={({route}) => ({
                      headerTitle: getHeaderTitle(route),
                    })}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </AuthContext.Provider>
  );
};
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
      - Drawer.Navigator
        - Drawer.Screen(roomdetail)
  */
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

const getHeaderTitle = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  // 특수 case
  if (route?.params?.roomName) {
    return route.params.roomName;
  }
  if (route?.params?.restaurantName) {
    return route.params.restaurantName;
  }
  // tab
  switch (routeName) {
    case 'my':
      return '내정보';
    case 'tab':
      return '메인';
    default:
      return '메인';
  }
};

export default Main;
