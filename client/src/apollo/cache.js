// 2020년 9월 기준 React Fast Refresh 시 반응형 변수 상태가 초기화되는 이슈가 있다.
import { InMemoryCache } from '@apollo/client';
// https://www.apollographql.com/docs/react/caching/cache-field-behavior/
const cache = new InMemoryCache({
  typePolicies: {},
});

export default cache;
