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
// https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignIn from './src/page/auth/SignIn.js';
import MainDrawer from './src/navigation/MainDrawer.js';
import {ApolloProvider} from '@apollo/client';
import client from './src/apollo/client';
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
export const AuthContext = createContext();
const App = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );
  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('token');
      } catch (e) {
        // Restoring token failed
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };
    bootstrapAsync();
  }, []);
  const authContext = useMemo(
    () => ({
      signIn: async (userId, password) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        console.log(userId, password);
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="drawer">
            {state.userToken === null ? (
              <Stack.Screen
                name="signin"
                component={SignIn}
                options={{title: '로그인'}}
              />
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
