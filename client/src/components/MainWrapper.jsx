import React from 'react';
import AppTabBar from 'src/components/AppTabBar';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from 'src/components/AppBar';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: theme.palette.custom.background,
      width: '100%',
      height: '100%',
    },
    main: {
      background: theme.palette.custom.white,
      height: '100%',
      width: '100%',
      margin: '0',
      overflowY: 'auto',
      [theme.breakpoints.up('md')]: {
        width: '50%',
        margin: '0 25% 0 25%',
      },
    },
    content: {
      background: theme.palette.custom.white,
      overflowY: 'auto',
      width: '100%',
      [theme.breakpoints.up('xs')]: {
        height: 'calc(100% - 6rem)',
      },
    },
  }),
);
const MainWrapper = ({ isTabBar = true, children, mainRef, ...rest }) => {
  const classes = useStyles({ isTabBar });
  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <AppBar />
        <AppTabBar />
        <div className={classes.content} {...rest}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainWrapper;
