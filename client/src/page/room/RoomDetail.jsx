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
import AttachmentIcon from '@material-ui/icons/Attachment';
import {
  MESSAGE_ERROR_AUTH,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS_UPDATE_USER_REMOVE_ROOM,
  MESSAGE_ERROR_UPLOAD,
} from 'src/res/message';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  isNotAuthorizedError,
  isNotAuthorizedErrorSubscription,
} from 'src/lib/error';
import { GET_PRESIGNED_PUT_URL } from 'src/lib/file.query';
import axios from 'axios';
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
  inputBottomFile: {
    cursor: 'pointer',
    borderColor: theme.palette.primary.main,
    borderRadius: '0.5rem',
    '&:hover': {
      background: theme.palette.custom.background,
    },
    width: 'fit-content',
    '& input': {
      display: 'none',
    },
    '& .MuiSvgIcon-root': {},
  },
}));
const RoomDetail = () => {
  const PAGE_SIZE = 30;
  const userId = useMemo(() => Cookie.get('_id'), []);
  const classes = useStyles();
  const history = useHistory();
  const { roomId } = useParams();
  const [content, setContent] = useState('');
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const contentRef = useRef(null);
  // 1. 대화 구독
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(CHAT_CREATED, {
    variables: {
      roomId,
    },
  });
  // 대화 구독 성공
  useEffect(() => {
    if (subscriptionData && !subscriptionError) {
      setChatList([subscriptionData.chatCreated, ...chatList]);
    }
  }, [subscriptionData]);
  // 대화 구독 실패
  useEffect(() => {
    if (isNotAuthorizedErrorSubscription(subscriptionError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (subscriptionError) {
      alert(MESSAGE_ERROR);
    }
  }, [subscriptionError]);
  // 2. 대화 로드
  const [
    getChatList,
    { data: lazyQueryData, loading: lazyQueryLoading, error: lazyQueryError },
  ] = useLazyQuery(GET_CHAT_LIST);
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
    if (lazyQueryData && !lazyQueryError) {
      setChatList([...chatList, ...lazyQueryData.getChatList]);
    }
  }, [lazyQueryData]);
  // 대화 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (lazyQueryError) {
      alert(MESSAGE_ERROR);
    }
  }, [lazyQueryError]);
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
  // 5. 파일 업로드
  // presigned url 로드
  const [
    getPresignedPutURL,
    {
      data: lazyQueryData2,
      loading: lazyQueryLoading2,
      error: lazyQueryError2,
    },
  ] = useLazyQuery(GET_PRESIGNED_PUT_URL);
  // presigned url 로드 성공
  useEffect(() => {
    if (lazyQueryData2 && !lazyQueryError2) {
      const presignedURL = lazyQueryData2.getPresignedPutURL.presignedURL;
      (async function () {
        try {
          // Presigned put url을 이용하여 업로드
          const result = await axios.put(presignedURL, file);
          const url = result.config.url.split('?')[0];
          const type = file.type.split('/')[0];
          const name = file.name;
          if (type === 'image') {
            createChat({
              variables: {
                createChatInput: {
                  roomId,
                  userId,
                  content: '사진',
                  imageURL: url,
                  thumbnailImageURL: url.replace(
                    'example-jb',
                    'example-jb-thumbnail',
                  ),
                },
              },
            });
          } else {
            createChat({
              variables: {
                createChatInput: {
                  roomId,
                  userId,
                  content: '파일',
                  fileURL: url,
                  fileName: name,
                },
              },
            });
          }
          const scroll =
            contentRef.current.scrollHeight - contentRef.current.clientHeight;
          contentRef.current.scrollTo(0, scroll);
        } catch (error) {
          alert(MESSAGE_ERROR_UPLOAD);
        }
        setIsLoading(false);
      })();
    }
  }, [lazyQueryData2]);
  // presigned url 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(lazyQueryError2)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (lazyQueryError2) {
      alert(MESSAGE_ERROR);
    }
  }, [lazyQueryError2]);
  const onChangeContent = (event) => {
    setContent(event.target.value);
  };
  const onClickCreateChatBtn = () => {
    if (!content) {
      return;
    }
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
    const scroll =
      contentRef.current.scrollHeight - contentRef.current.clientHeight;
    contentRef.current.scrollTo(0, scroll);
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
  const onChangeFileChange = (event) => {
    event.preventDefault();
    setIsLoading(true);
    let file = event.target.files[0];
    setFile(file);
    // Presigned put url을 가져옴.
    if (file) {
      const fileExtension = file.name.split('.').pop();
      getPresignedPutURL({
        variables: {
          key: `chat/${roomId}/${new Date().getTime()}.${fileExtension}`,
        },
      });
    }
  };
  return (
    <MainWrapper className={classes.root}>
      {mutationLoading2 && <Loading />}
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
          <label
            className={classes.inputBottomFile}
            htmlFor='file-upload-input-tag'
          >
            <AttachmentIcon fontSize='large' color='primary' />
            <input
              id='file-upload-input-tag'
              type='file'
              accept='*'
              onChange={onChangeFileChange}
            />
          </label>
        </div>
      </div>
    </MainWrapper>
  );
};
export default RoomDetail;
