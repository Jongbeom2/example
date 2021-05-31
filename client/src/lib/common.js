export const getShortStr = (str, length) => {
  if (!str) {
    return '';
  } else if (str.length > length) {
    return str.slice(0, length) + '...';
  } else {
    return str;
  }
};
