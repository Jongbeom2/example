import React, { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import { Button, Fab, InputBase } from '@material-ui/core';
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import {
  CREATE_CHAT,
  CHAT_CREATED,
  GET_CHAT_LIST,
  UPDATE_USER_REMOVE_ROOM,
} from './room.query';
import { useHistory, useParams } from 'react-router';
import Loading from 'src/components/Loading';
import ChatCard from './ChatCard';
import Cookie from 'js-cookie';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  MESSAGE_ERROR_AUTH,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS_UPDATE_USER_REMOVE_ROOM,
} from 'src/res/message';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isNotAuthorizedError } from 'src/lib/error';
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
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  btnWrapper: {
    width: '100%',
    top: 0,
    position: 'absolute',
    display: 'flex',
    zIndex: theme.zIndex.fixedBtn,
    justifyContent: 'space-between',
    '& button': {
      margin: theme.spacing(2),
    },
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
  const PAGE_SIZE = 30;
  const userId = useMemo(() => Cookie.get('_id'), []);
  const classes = useStyles();
  const history = useHistory();
  const { roomId } = useParams();
  const [page, setPage] = useState(0);
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  const contentRef = useRef(null);
  // 1. 대화 구독
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(CHAT_CREATED);
  // 대화 구독 성공
  useEffect(() => {
    if (subscriptionData && !subscriptionError) {
      setChatList([subscriptionData.chatCreated, ...chatList]);
    }
  }, [subscriptionData]);
  useEffect(() => {
    // TODO
    // subscription auth error 형태가 달라서 조건문이 안먹힘
    if (isNotAuthorizedError(subscriptionError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (subscriptionError) {
      alert(MESSAGE_ERROR);
    }
  }, [subscriptionError]);
  // 2. 대화 로드
  const [getChatList, { data, loading, error }] = useLazyQuery(GET_CHAT_LIST);
  useEffect(() => {
    getChatList({
      variables: {
        roomId,
        skip: 0,
        size: PAGE_SIZE,
      },
    });
  }, []);
  // 대화 로드 성공
  useEffect(() => {
    if (data && !error) {
      setChatList([...chatList, ...data.getChatList]);
      setPage(page + 1);
    }
  }, [data]);
  // 대화 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error]);
  // 3. 대화 생성
  const [
    createChat,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_CHAT);
  // 대화 생성 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (mutationError) {
      alert(MESSAGE_ERROR);
    }
  }, [mutationError]);
  // 4. 대화방 나가기
  const [
    updateUserRemoveRoom,
    { data: mutationData2, loading: mutationLoading2, error: mutationError2 },
  ] = useMutation(UPDATE_USER_REMOVE_ROOM);
  // 대화방 나가기 성공
  useEffect(() => {
    if (mutationData2 && !mutationError2) {
      alert(MESSAGE_SUCCESS_UPDATE_USER_REMOVE_ROOM);
      history.goBack();
    }
  }, [mutationData2]);
  // 대화방 나가기 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError2)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (mutationError2) {
      alert(MESSAGE_ERROR);
    }
  }, [mutationError2]);
  const onChangeContent = (event) => {
    setContent(event.target.value);
  };
  const onClickCreateChatBtn = () => {
    if (!content) {
      return;
    }
    const scroll =
      contentRef.current.scrollHeight - contentRef.current.clientHeight;
    contentRef.current.scrollTo(0, scroll);
    setContent('');
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
  const onClickBackBtn = () => {
    history.goBack();
  };
  const onClickOutBtn = () => {
    updateUserRemoveRoom({
      variables: {
        updateUserRemoveRoomInput: {
          userId,
          roomId,
        },
      },
    });
  };
  const onKeyPress = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      onClickCreateChatBtn();
      event.preventDefault();
    }
  };
  const onScrollTop = () => {
    getChatList({
      variables: {
        roomId,
        skip: chatList.length,
        size: PAGE_SIZE,
      },
    });
  };
  return (
    <MainWrapper className={classes.root}>
      {(loading || mutationLoading2) && <Loading />}
      <div className={classes.btnWrapper}>
        <Fab color='primary' size='small' onClick={onClickBackBtn}>
          <ArrowBackIcon fontSize='small' />
        </Fab>
        <Fab color='primary' size='small' onClick={onClickOutBtn}>
          <ExitToAppIcon fontSize='small' />
        </Fab>
      </div>
      <div className={classes.content} id='scrollableDiv' ref={contentRef}>
        <InfiniteScroll
          dataLength={chatList.length}
          next={onScrollTop}
          hasMore={true}
          inverse={true}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          scrollableTarget='scrollableDiv'
        >
          {chatList.map((chat) => (
            <ChatCard chat={chat} userId={userId} />
          ))}
        </InfiniteScroll>
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
            onKeyPress={onKeyPress}
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
