import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Avatar,
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Cookie from 'js-cookie';
import { SIGNOUT } from 'src/page/auth/auth.query';
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
    userWrapper: {
      float: 'right',
      width: '10rem',
      display: 'flex',
      justifyContent: 'space-evenly',
      '& p': {
        lineHeight: '40px',
      },
    },
    popper: {
      zIndex: theme.zIndex.popper,
    },
  }),
);

const CustomAppBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const anchorRef = useRef(null);
  const [nickname, setNickname] = useState(Cookie.get('nickname'));
  const [thumbnailImageURL, setThumbnailImageURL] = useState(
    Cookie.get('thumbnailImageURL'),
  );
  const [open, setOpen] = useState(false);
  const [signOut, { loading, error, data }] = useMutation(SIGNOUT);
  useEffect(() => {
    if (data && !error) {
      alert('로그아웃');
      setNickname('');
      setThumbnailImageURL('');
      history.push('/home');
    }
  }, [data]);
  const onClickTitleBtn = () => {
    history.push('/home');
  };
  const onClickSignInBtn = () => {
    history.push('/signin');
  };
  const onClickSignUpBtn = () => {
    history.push('/signup');
  };
  const onClickIcon = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const closeMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const onClickMyInfoBtn = () => {
    history.push(`/user/${Cookie.get('_id')}`);
  };
  const onClickSignOutBtn = () => {
    setOpen(false);
    signOut();
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
          {nickname && thumbnailImageURL ? (
            <div className={classes.userWrapper}>
              <Typography color='textPrimary' variant='body2'>
                {nickname}
              </Typography>
              <Avatar alt='Avatar' src={thumbnailImageURL} />
              <IconButton
                aria-label='delete'
                className={classes.margin}
                size='small'
                onClick={onClickIcon}
                ref={anchorRef}
              >
                <ArrowDropDownIcon fontSize='inherit' color='primary' />
              </IconButton>
            </div>
          ) : (
            <div className={classes.btnWrapper}>
              <Button color='primary' onClick={onClickSignInBtn}>
                로그인
              </Button>
              <Button color='primary' onClick={onClickSignUpBtn}>
                회원가입
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Popper
        className={classes.popper}
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={closeMenu}>
                <MenuList>
                  <MenuItem onClick={onClickMyInfoBtn}>내정보</MenuItem>
                  <MenuItem onClick={onClickSignOutBtn}>로그아웃</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default CustomAppBar;
