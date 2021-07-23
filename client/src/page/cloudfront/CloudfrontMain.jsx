import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
    fontSize: '30px',
  },
}));
const CloudfrontMain = () => {
  const classes = useStyles();
  const date =
    new Date().toLocaleDateString() + new Date().toLocaleTimeString();
  return (
    <div className={classes.root}>
      <div>Cloudfront Test</div>
      <div>Date from Client: {date}</div>
    </div>
  );
};
export default CloudfrontMain;
