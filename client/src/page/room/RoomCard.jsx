import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {},
}));
const RoomCard = ({ room }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>{room.name}</div>
      <div>{room.userNum}</div>
    </div>
  );
};
export default RoomCard;
