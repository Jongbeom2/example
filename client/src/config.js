let GRAPHQL_API_URL;
let FRONT_URL;
let S3_URL;
if (process.env.REACT_APP_MODE === 'production') {
  GRAPHQL_API_URL = 'https://churchapi.jongbeom.com/graphql';
  FRONT_URL = 'https://blessyou.jongbeom.com';
  S3_URL = 'https://blessyou.s3.ap-northeast-2.amazonaws.com';
} else if (process.env.REACT_APP_MODE === 'production-test') {
  GRAPHQL_API_URL = 'https://churchapi-test.jongbeom.com/graphql';
  FRONT_URL = 'https://blessyou-test.jongbeom.com';
  S3_URL = 'https://blessyou-test.s3.ap-northeast-2.amazonaws.com';
} else if (process.env.REACT_APP_MODE === 'development') {
  GRAPHQL_API_URL = 'http://localhost:4200/graphql';
  FRONT_URL = 'http://localhost:3200';
  S3_URL = 'https://blessyou-test.s3.ap-northeast-2.amazonaws.com';
}
const KAKAO_OPEN_QNA_ROOM = 'https://open.kakao.com/o/gnfRQuBc';
const KAKAO_CLIENT_ID = '9a11b2ff46a2c057da585c01aec56165';

export {
  GRAPHQL_API_URL,
  FRONT_URL,
  S3_URL,
  KAKAO_OPEN_QNA_ROOM,
  KAKAO_CLIENT_ID,
};
