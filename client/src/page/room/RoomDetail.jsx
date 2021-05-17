import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import { Button, InputBase } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CHAT, GET_CHAT_LIST } from './room.query';
import { useParams } from 'react-router';
import Loading from 'src/components/Loading';
import ChatCard from './ChatCard';
import Cookie from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.custom.lightBlue,
    height: 'calc(100% - 96px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  inputTop: {
    display: 'flex',
    background: theme.palette.custom.white,
    height: '3rem',
    padding: theme.spacing(1),
    '& button': {
      marginLeft: theme.spacing(1),
    },
  },
  inputBottom: {
    display: 'flex',
    padding: theme.spacing(1),
    background: theme.palette.custom.white,
  },
}));
const RoomDetail = () => {
  const classes = useStyles();
  const userId = Cookie.get('_id');
  const { roomId } = useParams();
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  // 대화 로드
  const { data, loading, error } = useQuery(GET_CHAT_LIST, {
    variables: {
      roomId,
    },
  });
  // 대화 로드 성공
  useEffect(() => {
    if (data && !error) {
      setChatList(data.getChatList);
    }
  }, [data]);
  // 대화 로드 실패
  //
  // 대화 생성
  const [
    createChat,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_CHAT);
  // 대화 생성 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      console.log(mutationData.createChat);
    }
  }, [mutationData]);
  // 대화 생성 실패
  //
  const onChangeContent = (event) => {
    setContent(event.target.value);
  };
  const onClickCreateChatBtn = () => {
    setContent('');
    if (!content) {
      return;
    }
    createChat({
      variables: {
        createChatInput: {
          roomId,
          userId,
          content,
        },
      },
    });
  };
  return (
    <MainWrapper className={classes.root}>
      <div className={classes.content}>
        {loading && <Loading />}
        {chatList.map((chat) => (
          <ChatCard chat={chat} userId={userId} />
        ))}
      </div>
      <div>
        <div className={classes.inputTop}>
          <InputBase
            fullWidth
            disableUnderline
            multiline
            autoFocus
            rowsMax={2}
            onChange={onChangeContent}
            value={content}
          />
          <Button
            variant='contained'
            color={content ? 'primary' : 'disabled'}
            onClick={onClickCreateChatBtn}
          >
            전송
          </Button>
        </div>
        <div className={classes.inputBottom}>
          <Button variant='outlined' color='primary'>
            파일
          </Button>
        </div>
      </div>
    </MainWrapper>
  );
};
export default RoomDetail;
