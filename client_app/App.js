import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useMemo, useReducer} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// 아이콘 패키지 : https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignIn from './src/page/auth/SignIn.js';
import MainDrawer from './src/navigation/MainDrawer.js';
import {ApolloProvider} from '@apollo/client';
import client from './src/apollo/client';
// Material UI 패키지 : https://callstack.github.io/react-native-paper/index.html
import {
  DefaultTheme,
  Provider as PaperProvider,
  Text,
} from 'react-native-paper';
import SignUp from './src/page/auth/SignUp.js';
import Loading from './src/page/loading/Loading.js';
const Stack = createStackNavigator();
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
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3379fe',
    accent: '#324e9b',
    custom: {
      textPrimary: '#222222',
      textSecondary: '#666666',
      kakao: '#f9e000',
      naver: '#04cf5c',
      google: '#4f8df5',
      grey: '#666666',
    },
  },
};
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
    })();
  }, []);
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{state, dispatch}}>
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
                <Stack.Screen
                  name="drawer"
                  component={MainDrawer}
                  options={{
                    title: '예제',
                    headerRight: HeaderRight,
                  }}
                />
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

export default App;
