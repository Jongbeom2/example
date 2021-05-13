import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';

const useStyles = makeStyles((theme) => ({
  root: {},
}));
const FeedMain = () => {
  const classes = useStyles();
  return <MainWrapper>FeedMain</MainWrapper>;
};
export default FeedMain;
