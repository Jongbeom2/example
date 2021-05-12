import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import logo from 'src/res/img/logo.png';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    appBarRoot: {
      background: theme.palette.custom.white,
    },
    toolBarRoot: {
      [theme.breakpoints.up('xs')]: {
        height: '3rem',
        minHeight: 'unset',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    btnWrapper: {
      float: 'right',
      width: '10rem',
      display: 'flex',
      justifyContent: 'space-evenly',
    },
  }),
);

const CustomAppBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const onClickTitleBtn = () => {
    history.push('/home');
  };
  const onClickSignInBtn = () => {
    history.push('/signin');
  };
  const onClickSignUpBtn = () => {
    history.push('/signup');
  };
  return (
    <div className={classes.root}>
      <AppBar classes={{ root: classes.appBarRoot }} position='static'>
        <Toolbar classes={{ root: classes.toolBarRoot }}>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='primary'
            aria-label='menu'
            onClick={null}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.title}
            color='primary'
            variant='h6'
            onClick={onClickTitleBtn}
          >
            {'예제'}
          </Typography>
          <div className={classes.btnWrapper}>
            <Button color='primary' onClick={onClickSignInBtn}>
              로그인
            </Button>
            <Button color='primary' onClick={onClickSignUpBtn}>
              회원가입
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default memo(CustomAppBar);
