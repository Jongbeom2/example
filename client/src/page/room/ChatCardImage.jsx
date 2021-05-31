import { Dialog, makeStyles } from '@material-ui/core';
import React, { Suspense, useState } from 'react';
import { useImage } from 'react-image';
import invalidImage from 'src/res/img/invalid_image.png';
const useStyles1 = makeStyles((theme) => ({}));
const ChatCardImage = ({ thumbnailImageURL, imageURL }) => {
  const classes = useStyles1();
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
        <ImageComponent
          thumbnailImageURL={thumbnailImageURL}
          imageURL={imageURL}
          onClick={onClick}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Dialog onClose={onClose} open={open}>
          <ImageComponent2 imageURL={imageURL} />
        </Dialog>
      </Suspense>
    </>
  );
};

const useStyles2 = makeStyles((theme) => ({
  root: {
    cursor: 'pointer',
    width: '15rem',
    borderRadius: '0.5rem',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));
const ImageComponent = ({ thumbnailImageURL, imageURL, ...rest }) => {
  const classes = useStyles2();
  const { src } = useImage({
    srcList: [thumbnailImageURL, imageURL, invalidImage],
  });
  return <img {...rest} src={src} className={classes.root} />;
};

const ImageComponent2 = ({ imageURL, ...rest }) => {
  const { src } = useImage({
    srcList: [imageURL, invalidImage],
  });
  return <img {...rest} src={src} />;
};
export default ChatCardImage;
