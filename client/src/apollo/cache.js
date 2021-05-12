import { InMemoryCache, makeVar, gql } from '@apollo/client';
// 2020년 9월 기준 React Fast Refresh 시 반응형 변수 상태가 초기화되는 이슈가 있다.

// Local states(reactive variables)
// reactive variable가 발동되면 참조하는 모든 로컬 쿼리가 자동으로 재실행
export const currentUserVar = makeVar(null);

// Local queries
export const GET_CURRENT_USER = gql`
  query {
    userLocal @client
  }
`;

// Apollo cache
// field별로 어떤 policy를 따르게할지 설정하는것
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        userLocal: () => {
          console.log('userLocal 참조');
          return currentUserVar();
        },
        userTmp1Local: () => {
          return currentUserVar();
        },
        userTmp2Local: () => {
          return currentUserVar();
        },
      },
    },
  },
});
