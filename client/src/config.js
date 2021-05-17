let GRAPHQL_API_URL;
let FRONT_URL;
if (process.env.REACT_APP_MODE === 'production') {
  GRAPHQL_API_URL = 'https://churchapi.jongbeom.com/graphql';
  FRONT_URL = 'https://blessyou.jongbeom.com';
} else if (process.env.REACT_APP_MODE === 'production-test') {
  GRAPHQL_API_URL = 'https://churchapi-test.jongbeom.com/graphql';
  FRONT_URL = 'https://blessyou-test.jongbeom.com';
} else if (process.env.REACT_APP_MODE === 'development') {
  GRAPHQL_API_URL = 'http://localhost:4200/graphql';
  FRONT_URL = 'http://localhost:3200';
}
const KAKAO_OPEN_QNA_ROOM = 'https://open.kakao.com/o/gnfRQuBc';
const KAKAO_CLIENT_ID = '9a11b2ff46a2c057da585c01aec56165';

export { GRAPHQL_API_URL, FRONT_URL, KAKAO_OPEN_QNA_ROOM, KAKAO_CLIENT_ID };
