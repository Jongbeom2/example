import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Typography } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/ko';
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
    maxWidth: '50%',
    width: 'fit-content',
    wordBreak: 'break-word',
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    background: theme.palette.custom.yellow,
    borderRadius: '0.5rem',
  },
  myChatCreatedAt: {
    height: '2rem',
    lineHeight: '2rem',
  },
  myChatFile: {
    textDecoration: 'none',
    '& button': {
      width: '10rem',
      height: '3rem',
      marginLeft: theme.spacing(1),
    },
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
    wordBreak: 'break-word',
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    background: theme.palette.custom.white,
    borderRadius: '0.5rem',
  },
  chatCreatedAt: {
    minWidth: '50%',
    marginRight: theme.spacing(1),
    height: '2rem',
    lineHeight: '2rem',
  },
  chatFile: {
    textDecoration: 'none',
    '& button': {
      width: '10rem',
      height: '3rem',
      marginRight: theme.spacing(1),
    },
  },
}));
const ChatCard = ({ chat, userId }) => {
  const classes = useStyles();
  const onClickFile = () => {};
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
    // 내 채팅
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
          // 이미지
          <ChatCardImage
            thumbnailImageURL={chat.thumbnailImageURL}
            imageURL={chat.imageURL}
          />
        ) : chat.fileURL ? (
          // 파일
          <a className={classes.myChatFile} href={chat.fileURL}>
            <Button variant='contained' onClick={onClickFile}>
              {chat.fileName}
            </Button>
          </a>
        ) : (
          // 텍스트
          <Typography variant='body2' className={classes.myChatContent}>
            {chat.content}
          </Typography>
        )}
      </div>
    );
  }
  // 상대 채팅
  return (
    <div className={classes.chatRoot}>
      <Avatar
        className={classes.chatAvatar}
        src={chat.user.profileThumbnailImageURL}
      />
      <div>
        <Typography>{chat.user.nickname}</Typography>
        {chat.imageURL ? (
          // 이미지
          <ChatCardImage
            thumbnailImageURL={chat.thumbnailImageURL}
            imageURL={chat.imageURL}
          />
        ) : chat.fileURL ? (
          // 파일
          <a className={classes.chatFile} href={chat.fileURL}>
            <Button variant='contained' onClick={onClickFile}>
              {chat.fileName}
            </Button>
          </a>
        ) : (
          // 텍스트
          <Typography variant='body2' className={classes.chatContent}>
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
