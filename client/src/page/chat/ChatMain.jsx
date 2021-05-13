import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MainWrapper from 'src/components/MainWrapper';

const useStyles = makeStyles((theme) => ({
  root: {},
}));
const ChatMain = () => {
  const classes = useStyles();
  return <MainWrapper>ChatMain</MainWrapper>;
};
export default ChatMain;
