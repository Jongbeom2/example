import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
  nickname: {},
  userNum: {
    paddingLeft: theme.spacing(2),
  },
}));
const RoomCard = ({ room }) => {
  const classes = useStyles();
  const history = useHistory();
  const onClick = () => {
    history.push(`/room/${room._id}`);
  };
  return (
    <div className={classes.root} onClick={onClick}>
      <Typography className={classes.nickname}>{room.name}</Typography>
      <Typography color='textSecondary' className={classes.userNum}>
        {room.userNum}명
      </Typography>
    </div>
  );
};
export default RoomCard;
