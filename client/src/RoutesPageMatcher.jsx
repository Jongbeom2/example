import React from 'react';
import { useParams } from 'react-router-dom';
import HomeMain from 'src/page/home/HomeMain';
import SignIn from './page/auth/SignIn';
import SignUp from './page/auth/SignUp';

const RoutesPageMatcher = () => {
  const { page } = useParams();
  switch (page) {
    case 'signin':
      return <SignIn />;
    case 'signup':
      return <SignUp />;
    default:
      return <HomeMain />;
  }
};
export default RoutesPageMatcher;
