import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router';
import MainWrapper from 'src/components/MainWrapper';
import { GET_RESTAURANT, UPDATE_RESTAURANT_RATING } from './restaurant.query';
import { isNotAuthorizedError } from 'src/lib/error';
import {
  MESSAGE_ERROR,
  MESSAGE_ERROR_AUTH,
  MESSAGE_ERROR_PDATE_RESTAURANT_RATING_INPUT_REQUIRED,
  MESSAGE_ERROR_UPDATE_RESTAURANT_RATING_EXIST_RATING,
  MESSAGE_SUCCESS_UPDATE_RESTAURANT_RATING,
} from 'src/res/message';
import { useMutation, useQuery } from '@apollo/client';
import Loading from 'src/components/Loading';
import SwipeableViews from 'react-swipeable-views';
import { Button, Fab, Paper, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Cookie from 'js-cookie';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  swipeableview: {
    height: '30%',
    width: '100%',
    '& div': {
      height: '100%',
      width: '100%',
    },
    '& img': {
      height: '100%',
      width: '100%',
    },
  },
  content: {
    position: 'absolute',
    top: 'calc(30% - 2rem)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    width: '80%',
  },
  ratingWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-root': {
      marginRight: theme.spacing(0.3),
      cursor: 'pointer',
    },
    '& button': {
      marginLeft: theme.spacing(1),
    },
  },
}));
const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const userId = useMemo(() => Cookie.get('_id'), []);
  const classes = useStyles();
  const history = useHistory();
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  // 식당 정보 로드
  const { data, loading, error } = useQuery(GET_RESTAURANT, {
    variables: { _id: restaurantId },
    fetchPolicy: 'cache-first',
  });
  // 식당 정보 로드 성공
  useEffect(() => {
    if (data && !error) {
      setRestaurant(data.getRestaurant);
    }
  }, [data, error]);
  // 식당 정보 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error, history]);
  // 식당 평점 수정
  const [
    updateRestaurantRating,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_RESTAURANT_RATING);
  // 식당 평점 수정 성공
  useEffect(() => {
    if (mutationData && !mutationError) {
      alert(MESSAGE_SUCCESS_UPDATE_RESTAURANT_RATING);
    }
  }, [mutationData, mutationError]);
  // 식당 평점 수정 실패
  useEffect(() => {
    if (isNotAuthorizedError(mutationError)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (mutationError?.message === 'EXIST_RESTAURANT_RATING') {
      alert(MESSAGE_ERROR_UPDATE_RESTAURANT_RATING_EXIST_RATING);
    } else if (mutationError) {
      alert(MESSAGE_ERROR);
    }
  }, [mutationError, history]);
  const onClickBackBtn = () => {
    history.goBack();
  };
  const onClickStar = (value) => {
    setRating(value);
  };
  const onClickRatingBtn = () => {
    if (!rating) {
      alert(MESSAGE_ERROR_PDATE_RESTAURANT_RATING_INPUT_REQUIRED);
      return;
    }
    updateRestaurantRating({
      variables: {
        updateRestaurantRatingInput: {
          _id: restaurantId,
          userId,
          rating,
        },
      },
    });
    setRating(0);
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {(loading || mutationLoading) && <Loading />}
        <div className={classes.btnWrapper}>
          <Fab color='primary' size='small' onClick={onClickBackBtn}>
            <ArrowBackIcon fontSize='small' />
          </Fab>
        </div>
        <SwipeableViews className={classes.swipeableview} enableMouseEvents>
          {restaurant?.imageURLList.map((imageURL, idx) => (
            <div key={idx}>
              <img src={imageURL} />
            </div>
          ))}
        </SwipeableViews>
        <Paper className={classes.content}>
          <Typography variant='h6' gutterBottom>
            {restaurant?.name}
          </Typography>
          <Typography variant='body1' gutterBottom>
            ⭐ {restaurant?.rating}
          </Typography>
          <Typography variant='body1' color='textSecondary' gutterBottom>
            최근리뷰 153
          </Typography>
          <Typography variant='body1' color='textSecondary' gutterBottom>
            최근사장님댓글 3
          </Typography>
          <div className={classes.ratingWrapper}>
            <Typography
              onClick={() => {
                onClickStar(1);
              }}
              variant='h6'
            >
              {rating >= 1 ? '⭐' : '☆'}
            </Typography>
            <Typography
              onClick={() => {
                onClickStar(2);
              }}
              variant='h6'
            >
              {rating >= 2 ? '⭐' : '☆'}
            </Typography>
            <Typography
              onClick={() => {
                onClickStar(3);
              }}
              variant='h6'
            >
              {rating >= 3 ? '⭐' : '☆'}
            </Typography>
            <Typography
              onClick={() => {
                onClickStar(4);
              }}
              variant='h6'
            >
              {rating >= 4 ? '⭐' : '☆'}
            </Typography>
            <Typography
              onClick={() => {
                onClickStar(5);
              }}
              variant='h6'
            >
              {rating >= 5 ? '⭐' : '☆'}
            </Typography>
            <Button
              onClick={onClickRatingBtn}
              variant='outlined'
              color='primary'
            >
              평점 남기기
            </Button>
          </div>
        </Paper>
      </div>
    </MainWrapper>
  );
};
export default RestaurantDetail;
