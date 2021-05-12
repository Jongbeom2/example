import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'absolute',
    zIndex: theme.zIndex.loadingPage,
    width: '100%',
    height: '100%',
    background: 'rgb(255, 255, 255, 0.7)',
    '& div': {
      position: 'absolute',
      height: '100%',
      top: 'calc(50% - 50px)',
    },
  },
}));
const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress size={100} />
    </div>
  );
};

export default Loading;
