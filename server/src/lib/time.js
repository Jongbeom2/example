export const getYYYYMMDD = (isoDateTime) => {
  // 백앤드 api Date로 수정한된 부분이 있어서 넣은 임시 코드
  if (typeof isoDateTime === 'string' && !isNaN(Number(isoDateTime))) {
    isoDateTime = Number(isoDateTime);
  }
  // isoDateTime 문자열을 받아 date 객체 생성
  const dateObject = new Date(isoDateTime);
  // 정상적인 date 객체인지 체크하고 (비정상적인 date 객체인 경우 getTime의 리턴값이 숫자가 아님)
  // 정상이면 date 객체 리턴하고 비정상이면 undefined 리턴
  if (isNaN(dateObject.getTime())) {
    return undefined;
  } else {
    // month
    let month = dateObject.getMonth();
    if (isNaN(month)) {
      return;
    } else {
      month = (month + 1).toString();
    }
    if (month.length === 1) month = '0' + month;
    // date
    let date = dateObject.getDate();
    if (isNaN(date)) {
      return;
    } else {
      date = date.toString();
    }
    if (date.length === 1) date = '0' + date;
    // year
    let year = dateObject.getFullYear();
    if (isNaN(year)) {
      return;
    } else {
      year = year.toString();
    }
    console.log(month, date, year);
    return `${year}-${month}-${date}`;
  }
};

export const getDateObject = (isoDateTime) => {
  // isoDateTime 문자열을 받아 date 객체 생성
  const dateObject = new Date(isoDateTime);
  // 정상적인 date 객체인지 체크하고 (비정상적인 date 객체인 경우 getTime의 리턴값이 숫자가 아님)
  // 정상이면 date 객체 리턴하고 비정상이면 undefined 리턴
  if (isNaN(dateObject.getTime())) {
    return undefined;
  } else {
    return dateObject;
  }
};

export const getKRLocalDateString = (newDate) => {
  // const newDate = new Date();
  const krLocalString = newDate.toLocaleDateString('ko-KR');

  if (krLocalString.includes('.')) {
    const year = `${krLocalString.split('.')[0]}`;
    const month =
      krLocalString.split('. ')[1].length === 1
        ? `0${krLocalString.split('. ')[1]}`
        : `${krLocalString.split('. ')[1]}`;
    //뒤에 . 미포함: 1 혹은 11
    const day =
      krLocalString.split('. ')[2].length === 2
        ? `0${krLocalString.split('. ')[2].substring(0, 1)}`
        : `${krLocalString.split('. ')[2].substring(0, 2)}`;
    //뒤에 . 포함: 1. 혹은 11.
    return `${year}-${month}-${day}`;
  } else if (krLocalString.includes('-')) {
    const year = `${krLocalString.split('-')[0]}`;
    const month =
      krLocalString.split('-')[1].length === 1
        ? `0${krLocalString.split('-')[1]}`
        : `${krLocalString.split('-')[1]}`;
    //뒤에 . 미포함: 1 혹은 11
    const day =
      krLocalString.split('-')[2].length === 1
        ? `0${krLocalString.split('-')[2]}`
        : `${krLocalString.split('-')[2]}`;
    //뒤에 . 포함: 1. 혹은 11.
    return `${year}-${month}-${day}`;
  } else if (krLocalString.includes('/')) {
    const year = `${krLocalString.split('/')[2]}`;
    const month =
      krLocalString.split('/')[0].length === 1
        ? `0${krLocalString.split('/')[0]}`
        : `${krLocalString.split('/')[0]}`;
    const day =
      krLocalString.split('/')[1].length === 1
        ? `0${krLocalString.split('/')[1]}`
        : `${krLocalString.split('/')[1]}`;
    return `${year}-${month}-${day}`;
  }
};

export const MONTH_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;
export const WEEK_IN_MILLISECONS = 7 * 24 * 60 * 60 * 1000;
