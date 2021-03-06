import React from 'react';
import { Route, useParams } from 'react-router-dom';
import HomeMain from 'src/page/home/HomeMain';
import SignIn from './page/auth/SignIn';
import SignInKakao from './page/auth/SignInKakao';
import SignUp from './page/auth/SignUp';
import UserRouter from './page/user/UserRouter';
import AuthRoute from './components/AuthRoute';
import RoomRouter from './page/room/RoomRouter';
import RestaurantRouter from './page/restaurant/RestaurantRouter';
import CloudfrontMain from './page/cloudfront/CloudfrontMain';

const RoutesPageMatcher = () => {
  const { page } = useParams();
  switch (page) {
    case 'signin':
      return (
        <Route>
          <SignIn />
        </Route>
      );
    case 'signinkakao':
      return (
        <Route>
          <SignInKakao />
        </Route>
      );
    case 'signup':
      return (
        <Route>
          <SignUp />
        </Route>
      );
    case 'user':
      return (
        <AuthRoute>
          <UserRouter />
        </AuthRoute>
      );
    case 'room':
      return (
        <AuthRoute>
          <RoomRouter />
        </AuthRoute>
      );
    case 'restaurant':
      return (
        <AuthRoute>
          <RestaurantRouter />
        </AuthRoute>
      );
    case 'cloudfront':
      return (
        <Route>
          <CloudfrontMain />
        </Route>
      );
    default:
      return (
        <AuthRoute>
          <HomeMain />
        </AuthRoute>
      );
  }
};
export default RoutesPageMatcher;
