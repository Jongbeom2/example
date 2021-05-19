import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Typography } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/ko';
import { Img } from 'react-image';
import ChatCardImage from './ChatCardImage';
const useStyles = makeStyles((theme) => ({
  systemChatRoot: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1),
  },
  systemChatContent: {
    width: 'fit-content',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.primary.dark,
    color: theme.palette.custom.white,
    height: '2rem',
    lineHeight: '2rem',
    borderRadius: '1rem',
  },
  myChatRoot: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(1),
  },
  myChatContent: {
    width: 'fit-content',
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.custom.yellow,
    height: '2rem',
    lineHeight: '2rem',
    borderRadius: '0.5rem',
  },
  myChatCreatedAt: {
    height: '2rem',
    lineHeight: '2rem',
  },
  myChatImg: {
    width: '15rem',
    borderRadius: '0.5rem',
    marginLeft: theme.spacing(1),
  },
  chatRoot: {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: theme.spacing(1),
  },
  chatAvatar: {
    marginRight: theme.spacing(1),
  },
  chatContent: {
    width: 'fit-content',
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.custom.white,
    height: '2rem',
    lineHeight: '2rem',
    borderRadius: '0.5rem',
  },
  chatCreatedAt: {
    marginRight: theme.spacing(1),
    height: '2rem',
    lineHeight: '2rem',
  },
  chatImg: {
    width: '15rem',
    borderRadius: '0.5rem',
    marginRight: theme.spacing(1),
  },
}));
const ChatCard = ({ chat, userId }) => {
  const classes = useStyles();
  if (chat.isSystem) {
    return (
      <div className={classes.systemChatRoot}>
        <Typography className={classes.systemChatContent}>
          {chat.user.nickname}
          {chat.content}
        </Typography>
      </div>
    );
  }
  if (chat.user._id === userId) {
    return (
      <div className={classes.myChatRoot}>
        <Typography
          className={classes.myChatCreatedAt}
          color='textSecondary'
          variant='body2'
        >
          {moment(new Date(chat.createdAt)).fromNow()}
        </Typography>
        {chat.imageURL ? (
          <ChatCardImage
            className={classes.myChatImg}
            srcList={[chat.thumbnailImageURL, chat.imageURL]}
          />
        ) : (
          <Typography className={classes.myChatContent}>
            {chat.content}
          </Typography>
        )}
      </div>
    );
  }
  return (
    <div className={classes.chatRoot}>
      <Avatar
        className={classes.chatAvatar}
        src={chat.user.profileThumbnailImageURL}
      />
      <div>
        <Typography>{chat.user.nickname}</Typography>
        {chat.imageURL ? (
          <ChatCardImage
            className={classes.chatImg}
            srcList={[chat.thumbnailImageURL, chat.imageURL]}
          />
        ) : (
          <Typography className={classes.chatContent}>
            {chat.content}
          </Typography>
        )}
      </div>
      <Typography
        className={classes.chatCreatedAt}
        color='textSecondary'
        variant='body2'
      >
        {moment(new Date(chat.createdAt)).fromNow()}
      </Typography>
    </div>
  );
};
export default ChatCard;
