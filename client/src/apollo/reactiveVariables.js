import { makeVar } from '@apollo/client';
export const userVar = makeVar({
  _id: '',
  nickname: '',
  profileImageURL: '',
  profileThumbnailImageURL: '',
});
