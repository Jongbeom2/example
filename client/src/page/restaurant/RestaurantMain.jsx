import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MainWrapper from 'src/components/MainWrapper';
import pinBlack from 'src/res/img/pin_black.png';
import pinBlue from 'src/res/img/pin_blue.png';
import pinYellow from 'src/res/img/pin_yellow.png';
import pinRed from 'src/res/img/pin_red.png';
const dataList = [
  {
    _id: 1,
    name: '분당 두부',
    lat: 37.35148,
    lan: 127.1093,
    rating: 5,
  },
  {
    _id: 2,
    name: '서울 감자탕',
    lat: 37.34706,
    lan: 127.11049,
    rating: 3,
  },
  {
    _id: 3,
    name: '서브웨이',
    lat: 37.34993,
    lan: 127.10788,
    rating: 2,
  },
];
const useStyles = makeStyles((theme) => ({
  map: {
    width: '100%',
    height: '100%',
  },
}));
const RestaurantMain = () => {
  const classes = useStyles();
  const mapRef = useRef(null);
  useEffect(() => {
    // map
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.350376, 127.10892),
      zoom: 15,
    });
    dataList.forEach((data) => {
      // mark
      const markerOptions = {
        position: new window.naver.maps.LatLng(data.lat, data.lan),
        map: map,
        title: 'a',
        icon: {
          content: `<img src=${getImage(
            data.rating,
          )} style="width:40px; height:40px;"/>`,
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(20, 40),
        },
      };
      const marker = new window.naver.maps.Marker(markerOptions);
    });
  }, []);
  return (
    <MainWrapper>
      <div className={classes.map} ref={mapRef} />
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
