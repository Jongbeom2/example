import AsyncStorage from '@react-native-async-storage/async-storage';
import {InMemoryCache} from '@apollo/client/core';
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist';
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getMyRoomList: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});
// 비동기적으로 실행됨.
persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
});
export default cache;
