import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    cursor: 'pointer',
    display: 'flex',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.custom.border}`,
    '&:hover': {
      backgroundColor: theme.palette.custom.border,
    },
  },
  image: {
    borderRadius: '5px',
    width: '50px',
    height: '50px',
    marginRight: theme.spacing(1),
  },
}));
const RestaurantCard = ({ restaurant }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img className={classes.image} src={restaurant.profileImageURL} />
      <div className={classes.content}>
        <Typography variant='body1'>{restaurant.name}</Typography>
        <Typography variant='body2'>⭐ {restaurant.rating}</Typography>
      </div>
    </div>
  );
};
export default RestaurantCard;
