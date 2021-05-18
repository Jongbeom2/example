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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Cookie from 'js-cookie';
import { SIGNOUT } from 'src/page/auth/auth.query';
import { MESSAGE_ERROR } from 'src/res/message';
import { GET_USER } from 'src/page/user/user.query';
import { userVar } from 'src/apollo/reactiveVariables';
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
  const userId = useMemo(() => Cookie.get('_id'), []);
  const history = useHistory();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  // 유저 정보 로드
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { _id: userId },
    fetchPolicy: 'cache-first',
  });
  const [user, setUser] = useState(data?.getUser || null);
  // 유저 정보 로드 성공
  useEffect(() => {
    if (data && !error) {
      setUser(data.getUser);
      userVar({
        _id: data.getUser._id,
        nickname: data.getUser.nickname,
        profileImageURL: data.getUser.profileImageURL,
        profileThumbnailImageURL: data.getUser.profileThumbnailImageURL,
      });
    }
  }, [data]);
  // 유저 정보 로드 실패
  useEffect(() => {
    if (error) {
      alert(MESSAGE_ERROR);
      history.push('/signin');
    }
  }, [error]);
  // 로그아웃
  const [
    signOut,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(SIGNOUT);
  // 로그 아웃 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      alert('로그아웃');
      Cookie.remove('accessToken');
      Cookie.remove('_id');
      history.push('/signin');
    }
  }, [mutationData]);
  // 로그 아웃 실패
  useEffect(() => {
    if (mutationError) {
      alert(MESSAGE_ERROR);
    }
  }, [mutationError]);
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
          {user ? (
            <div className={classes.userWrapper}>
              <Typography color='textPrimary' variant='body2'>
                {user.nickname}
              </Typography>
              <Avatar alt='Avatar' src={user.profileThumbnailImageURL} />
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
