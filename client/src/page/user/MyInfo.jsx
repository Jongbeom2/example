import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
const useStyles = makeStyles((theme) => ({
  root: {},
}));
const MyInfo = () => {
  const classes = useStyles();
  return (
    <MainWrapper>
      <div>aa</div>
    </MainWrapper>
  );
};
export default MyInfo;
