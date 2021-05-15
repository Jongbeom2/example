import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import ForumIcon from '@material-ui/icons/Forum';
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    '&:hover': {
      background: theme.palette.custom.background,
    },
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    '& p': {
      paddingLeft: theme.spacing(2),
    },
  },
}));
const UserCard = ({ user }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.root} container>
      <Grid className={classes.userInfo} item xs={10}>
        <Avatar alt='avatar' src={user.profileThumbnailImageURL} />
        <Typography className={classes.nickname}>{user.nickname}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Button variant='outlined'>대화</Button>
      </Grid>
    </Grid>
  );
};
export default UserCard;
