import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: theme.zIndex.loadingPage,
    width: 200,
    height: 100,
    borderRadius: 5,
    margin: theme.spacing(1),
    background: 'rgb(0, 0, 0, 0.7)',
    '& div': {
      position: 'absolute',
      height: '100%',
      top: 'calc(50% - 25px)',
    },
  },
}));
const ResizeLoading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress size={50} />
    </div>
  );
};

export default ResizeLoading;
