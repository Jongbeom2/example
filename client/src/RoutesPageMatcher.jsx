import React from 'react';
import { useParams } from 'react-router-dom';
import HomeMain from 'src/page/home/HomeMain';
import SignIn from './page/auth/SignIn';
import SignInKakao from './page/auth/SignInKakao';
import SignUp from './page/auth/SignUp';
import ChatMain from './page/chat/ChatMain';
import FeedMain from './page/feed/FeedMain';
import MyInfo from './page/user/MyInfo';

const RoutesPageMatcher = () => {
  const { page } = useParams();
  switch (page) {
    case 'signin':
      return <SignIn />;
    case 'signinkakao':
      return <SignInKakao />;
    case 'signup':
      return <SignUp />;
    case 'myinfo':
      return <MyInfo />;
    case 'feed':
      return <FeedMain />;
    case 'chat':
      return <ChatMain />;
    default:
      return <HomeMain />;
  }
};
export default RoutesPageMatcher;
