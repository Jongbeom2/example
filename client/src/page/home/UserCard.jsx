import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    '&:hover': {
      background: theme.palette.custom.background,
    },
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  nickname: {
    paddingLeft: theme.spacing(2),
  },
}));
const UserCard = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();
  const onClick = () => {
    history.push(`user/${user._id}`);
  };
  return (
    <div className={classes.root} onClick={onClick}>
      <Avatar alt='avatar' src={user.profileThumbnailImageURL} />
      <Typography className={classes.nickname}>{user.nickname}</Typography>
    </div>
  );
};
export default UserCard;
