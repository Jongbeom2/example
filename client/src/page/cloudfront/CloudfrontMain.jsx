import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { GET_NOW } from './cloudfront.query';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
    fontSize: '30px',
  },
}));
const CloudfrontMain = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_NOW);
  const clientDate =
    new Date().toLocaleDateString() + new Date().toLocaleTimeString();
  const serverDate =
    new Date(data?.getNow).toLocaleDateString() +
    new Date(data?.getNow).toLocaleTimeString();
  return (
    <div className={classes.root}>
      <div>Cloudfront Test</div>
      <div>Date from Client: {clientDate}</div>
      <div>Date from Server: {serverDate}</div>
    </div>
  );
};
export default CloudfrontMain;
