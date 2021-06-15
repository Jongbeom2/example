import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import pinBlack from 'src/res/img/pin_black.png';
import pinBlue from 'src/res/img/pin_blue.png';
import pinYellow from 'src/res/img/pin_yellow.png';
import pinRed from 'src/res/img/pin_red.png';
import myLocation from 'src/res/img/my_location.png';
import { GET_RESTAURANT_LIST } from './restaurant.query';
import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { MESSAGE_ERROR, MESSAGE_ERROR_AUTH } from 'src/res/message';
import { isNotAuthorizedError } from 'src/lib/error';
import { useHistory } from 'react-router';
import Loading from 'src/components/Loading';
import RestaurantCard from './RestaurantCard';
import { Fab } from '@material-ui/core';
import MyLocationIcon from '@material-ui/icons/MyLocation';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  btnWrapper: {
    width: '100%',
    top: 0,
    position: 'absolute',
    display: 'flex',
    zIndex: theme.zIndex.fixedBtn,
    justifyContent: 'flex-end',
    '& button': {
      margin: theme.spacing(2),
    },
  },
  map: {
    width: '100%',
    flex: 1,
    outline: 'none',
  },
  list: {
    backgroundColor: theme.palette.custom.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '50rem',
    overflow: 'auto',
  },
  clearBtn: {
    cursor: 'pointer',
    textAlign: 'center',
    padding: theme.spacing(1),
    height: 20,
    '&:hover': {
      backgroundColor: theme.palette.custom.border,
    },
  },
}));
const RestaurantMain = () => {
  const classes = useStyles();
  const history = useHistory();
  const mapRef = useRef(null);
  const [map, setMap] = useState();
  const [restaurantList, setRestaurantList] = useState([]);
  const [markerList, setMarkerList] = useState([]);
  const [clickedMarker, setClickedMarker] = useState(null);
  const [myLocationMarker, setMyLocationMarker] = useState(null);
  // 식당 리스트
  const [getRestaurantList, { data, loading, error }] = useLazyQuery(
    GET_RESTAURANT_LIST,
  );
  // 식당 리스트 로드
  useEffect(() => {
    if (data && !error) {
      setRestaurantList(data.getRestaurantList);
    }
  }, [data, error]);
  // 식당 리스트 로드 실패
  useEffect(() => {
    if (isNotAuthorizedError(error)) {
      alert(MESSAGE_ERROR_AUTH);
      history.push('/signin');
    } else if (error) {
      alert(MESSAGE_ERROR);
    }
  }, [error, history]);
  // 초기화
  useEffect(() => {
    // 맵 초기화
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.350376, 127.10892),
      zoom: 17,
    });
    setMap(map);
    // 맵에 이벤트 추가
    window.naver.maps.Event.addListener(map, 'idle', () => {
      const bounds = map.getBounds();
      getRestaurantList({
        variables: {
          minLat: bounds._min._lat,
          maxLat: bounds._max._lat,
          minLng: bounds._min._lng,
          maxLng: bounds._max._lng,
        },
      });
    });

    // 데이터 불러오기
    const bounds = map.getBounds();
    getRestaurantList({
      variables: {
        minLat: bounds._min._lat,
        maxLat: bounds._max._lat,
        minLng: bounds._min._lng,
        maxLng: bounds._max._lng,
      },
    });
    // // 내위치 그리기
    // window.navigator.geolocation.watchPosition((location) => {
    //   console.log(location);
    //   const markerOptions = {
    //     position: new window.naver.maps.LatLng(
    //       location.coords.latitude,
    //       location.coords.longitude,
    //     ),
    //     map,
    //     icon: {
    //       content: `<img src=${myLocation} style="width:40px; height:40px;"/>`,
    //       origin: new window.naver.maps.Point(0, 0),
    //       anchor: new window.naver.maps.Point(20, 40),
    //     },
    //   };
    //   const tempMyLocationMarker = new window.naver.maps.Marker(markerOptions);
    //   setMyLocationMarker((prevMyLocationMarker) => {
    //     if (prevMyLocationMarker) {
    //       prevMyLocationMarker.setMap(null);
    //     }
    //     return tempMyLocationMarker;
    //   });
    // });
  }, [getRestaurantList]);
  // 새로운 데이터
  useEffect(() => {
    const tempMarkerList = [];
    // 1. 마커 그리기
    // 2. 마커에 식당 저장하기
    // 3. 마커에 이벤트 등록하기
    restaurantList.forEach((restaurant) => {
      const markerOptions = {
        position: new window.naver.maps.LatLng(restaurant.lat, restaurant.lng),
        map,
        icon: {
          content: `<img src=${getImage(
            restaurant.rating,
          )} style="width:40px; height:40px;"/>`,
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(20, 40),
        },
      };
      const tempMarker = new window.naver.maps.Marker(markerOptions);
      tempMarker.restaurant = restaurant;
      tempMarker.addListener('mouseover', (e) => {
        const marker = e.overlay;
        marker.setIcon({
          content: `<img src=${getImage(
            tempMarker.restaurant.rating,
          )} style="width:50px; height:50px;"/>`,
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(25, 50),
        });
      });
      tempMarker.addListener('mouseout', (e) => {
        const marker = e.overlay;
        marker.setIcon({
          content: `<img src=${getImage(
            tempMarker.restaurant.rating,
          )} style="width:40px; height:40px;"/>`,
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(20, 40),
        });
      });
      tempMarkerList.push(tempMarker);
    });
    // 4. 마커에 주위마커 저장하기
    tempMarkerList.forEach((tempMarker) => {
      tempMarker.overlapedMarkerList = [];
      const proj = map.getProjection();
      const position = tempMarker.getPosition();
      const offset = proj.fromCoordToOffset(position);
      const tolerance = 10;
      const rectLeftTop = offset.clone().sub(tolerance, tolerance);
      const rectRightBottom = offset.clone().add(tolerance, tolerance);
      const baseRect = window.naver.maps.PointBounds.bounds(
        rectLeftTop,
        rectRightBottom,
      );
      tempMarkerList.forEach((tempMarker2) => {
        if (tempMarker !== tempMarker2) {
          const proj2 = map.getProjection();
          const position2 = tempMarker2.getPosition();
          const offset2 = proj2.fromCoordToOffset(position2);
          const tolerance2 = 10;
          const rectLeftTop2 = offset2.clone().sub(tolerance2, tolerance2);
          const rectRightBottom2 = offset2.clone().add(tolerance2, tolerance2);
          const targetRec = window.naver.maps.PointBounds.bounds(
            rectLeftTop2,
            rectRightBottom2,
          );
          if (baseRect.intersects(targetRec)) {
            tempMarker.overlapedMarkerList.push(tempMarker2);
          }
        }
      });
    });
    // 5. 마커에 click event 등록하기
    tempMarkerList.forEach((tempMarker) => {
      tempMarker.addListener('click', (e) => {
        setClickedMarker(e.overlay);
      });
    });
    // 6. 기존 마커 지우기
    setMarkerList((prevMarkerList) => {
      prevMarkerList.forEach((marker) => {
        marker.setMap(null);
      });
      return tempMarkerList;
    });
  }, [restaurantList, map]);
  const onClickClear = () => {
    setClickedMarker(null);
  };
  const onClickMyLocationBtn = () => {
    map.panTo(myLocationMarker.position);
  };
  return (
    <MainWrapper>
      <div className={classes.root}>
        {loading && <Loading />}
        <div className={classes.btnWrapper}>
          <Fab
            color={myLocationMarker ? 'primary' : ''}
            size='small'
            onClick={onClickMyLocationBtn}
          >
            <MyLocationIcon fontSize='small' />
          </Fab>
        </div>
        <div className={classes.map} ref={mapRef} />
        <div className={classes.list}>
          {clickedMarker?.restaurant && (
            <>
              <div className={classes.clearBtn} onClick={onClickClear}>
                접기 🔻
              </div>
              {[
                clickedMarker.restaurant,
                ...clickedMarker.overlapedMarkerList.map(
                  (marker) => marker.restaurant,
                ),
              ].map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </>
          )}
        </div>
      </div>
    </MainWrapper>
  );
};
export default RestaurantMain;
const getImage = (rating) => {
  if (rating < 1.25) {
    return pinBlack;
  } else if (rating < 2.5) {
    return pinBlue;
  } else if (rating < 3.75) {
    return pinYellow;
  } else {
    return pinRed;
  }
};
