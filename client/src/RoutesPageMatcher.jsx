import React from 'react';
import { useParams } from 'react-router-dom';
import HomeMain from 'src/page/home/HomeMain';
import SignIn from './page/auth/SignIn';
import SignInKakao from './page/auth/SignInKakao';
import SignUp from './page/auth/SignUp';
import RoomMain from './page/room/RoomMain';
import FeedMain from './page/feed/FeedMain';
import UserRouter from './page/user/UserRouter';

const RoutesPageMatcher = () => {
  const { page } = useParams();
  switch (page) {
    case 'signin':
      return <SignIn />;
    case 'signinkakao':
      return <SignInKakao />;
    case 'signup':
      return <SignUp />;
    case 'user':
      return <UserRouter />;
    case 'feed':
      return <FeedMain />;
    case 'room':
      return <RoomMain />;
    default:
      return <HomeMain />;
  }
};
export default RoutesPageMatcher;
