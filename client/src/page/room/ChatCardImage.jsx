import { Dialog, makeStyles } from '@material-ui/core';
import React, { Suspense, useState } from 'react';
import { useImage } from 'react-image';
import invalidImage from 'src/res/img/invalid_image.png';

const ChatCardImage = ({ imageURL }) => {
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Suspense fallback={null}>
        <ImageComponent imageURL={imageURL} onClick={onClick} />
      </Suspense>
      <Suspense fallback={null}>
        <Dialog onClose={onClose} open={open}>
          <ImageComponent2 imageURL={imageURL} />
        </Dialog>
      </Suspense>
    </>
  );
};

const useStyles1 = makeStyles((theme) => ({
  root: {
    cursor: 'pointer',
    width: '15rem',
    borderRadius: '0.5rem',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
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
  return <img alt='chat-image1' {...rest} src={src} className={classes.root} />;
};
const useStyles2 = makeStyles((theme) => ({}));
const ImageComponent2 = ({ imageURL, ...rest }) => {
  const classes = useStyles2();
  const { src } = useImage({
    srcList: [process.env.REACT_APP_STORAGE_URL + imageURL, invalidImage],
  });
  return <img alt='chat-image2' {...rest} src={src} className={classes.root} />;
};
export default ChatCardImage;
