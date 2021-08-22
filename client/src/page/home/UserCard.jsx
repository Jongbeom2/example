import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
import invalidImage from 'src/res/img/invalid_image.png';
import { Suspense } from 'react';
import { useImage } from 'react-image';
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
      <Suspense fallback={null}>
        <ImageComponent imageURL={user?.profileImageURL} />
      </Suspense>
      <Typography className={classes.nickname}>{user.nickname}</Typography>
    </div>
  );
};
const useStyles1 = makeStyles((theme) => ({
  root: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
  },
}));
const ImageComponent = ({ imageURL, ...rest }) => {
  const classes = useStyles1();
  const { src } = useImage({
    srcList: [
      process.env.REACT_APP_STORAGE_RESIZED_URL + imageURL,
      process.env.REACT_APP_STORAGE_URL + imageURL,
      invalidImage,
    ],
  });
  return <img alt='user' {...rest} src={src} className={classes.root} />;
};
export default UserCard;
