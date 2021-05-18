import React, { createContext, useReducer } from 'react';
import { ApolloProvider } from '@apollo/client';
import {
  createMuiTheme,
  ThemeProvider,
  StylesProvider,
} from '@material-ui/core/styles';
import styled, {
  ThemeProvider as StyledThemeProvider,
} from 'styled-components';
import Theme from 'src/Theme';
import Router from 'src/routes';
import client from 'src/apollo/client';
import 'react-toastify/dist/ReactToastify.css';

const myTheme = createMuiTheme({
  /**
   * typography
   * h4 : 큰 title
   * h6 : 일반적인 title
   * subtitle1: 작은 title
   */
  props: {
    MuiTypography: {
      variantMapping: {},
    },
  },
  typography: {
    fontFamily: ['NanumBarunGothic'],
    body2: {
      fontSize: '0.8rem',
    },
    subtitle1: {
      fontSize: '0.8rem',
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    fixedBtn: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
    popper: 1500,
    loadingPage: 1600,
    errorPage: 1600,
  },
  palette: {
    primary: {
      main: '#3379fe',
    },
    secondary: {
      main: '#324e9b',
    },
    error: {
      main: '#e74c3c',
    },
    text: {
      primary: '#222222',
      secondary: '#666666',
    },
    custom: {
      black: '#000000',
      background: '#ecf0f1',
      border: '#ecf0f1',
      grey: '#666666',
      red: '#e74c3c',
      yellow: '#f9e000',
      teal: '#00B8D9',
      lightBlue: '#DEEBFF',
      white: '#ffffff',
    },
  },
});

export const AppContext = createContext();

const App = () => {
  // context
  const intialState = {
    drawerState: false,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_DRAWER_STATE':
        return {
          ...state,
          drawerState: action.drawerState,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, intialState);

  return (
    <ApolloProvider client={client}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={myTheme}>
          <StyledThemeProvider theme={Theme}>
            <AppContext.Provider value={{ state, dispatch }}>
              <Router />
            </AppContext.Provider>
          </StyledThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </ApolloProvider>
  );
};

export default App;
