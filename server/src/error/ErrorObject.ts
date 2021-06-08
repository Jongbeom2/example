/**
 * @name
 * Error 처리를 위한 객체
 * 같은 에러인데도 서로 다른 Error Message, Error Code, Error Property를 출력하는 일을 방지해야함
 * 사용하는 에러 객체가 있다면 여기에 명시하기
 * thorw new Error('ABCD')로 Error 객체를 사용한다면 Error Code가 INTERNAL_SERVER_ERROR로 통일됨 (좋은 방법이 아님)
 * 여기에서 정의하는 Error는 어떤 오류에 의해서 발생하는 에러가 아님 (이 경우는 graphql에서 이미 다 처리가 되어있음)
 * ex) graphql 스키마 정의와 맞지 않게 요청하는 경우
 * 여기에서 정의하는 Error는 오류가 발생하지 않더라도 Error를 발생시켜야하는 경우임
 * ex) 잘못된 유저 정보 입력, 잘못된 권한으로 요청
 * 참고 자료 : https://www.apollographql.com/docs/apollo-server/data/errors
 */
import { AuthenticationError, ForbiddenError, UserInputError, ApolloError } from 'apollo-server';
/**
 * @name CustomError
 * @param {string} errorMessage
 * @param {string} errorCode
 * @param {string} errorProperties
 * @description
 * 이 포멧에 맞춰서 에러 객체를 정의해야함.
 */
export const customError = new ApolloError('Custom Error', 'CUSTOM_ERROR', {
  customProperty: 'Custom Property',
});
/**
 * @name EnvironmentError
 * @description
 * 환경 변수 설정이 잘못됨.
 */
export const environmentError = new Error('INVALID_ENVIRONMENT: ' + process.env.NODE_ENV);
/**
 * @name NotAuthorizedError
 * @description
 * 로그인이 안됨.
 */
export const notAuthorizedError = new ApolloError('NOT_AUTHORIZED', 'NOT_AUTHORIZED');
/**
 * @name InvalidContextError
 * @description
 * 잘못된 컨텐스트임.
 */
export const invalidContextError = new Error('INVALID_CONTEXT');
/**
 * @name CorsError
 * @description
 * 잘못된 origin임.
 */
export const corsError = new Error('CORS');
/**
 * @name InvalidUserIdError
 * @description
 * 존재하지않는 userId임.
 */
export const invalidUserIdError = new ApolloError('INVALID_USER_ID', 'INVALID_USER_ID');
/**
 * @name InvalidUserInfo
 * @description
 * 존재하지 않는 user email임.
 */
export const invalidUserEmailError = new ApolloError('INVALID_USER_INFO', 'INVALID_USER_INFO');
/**
 * @name InvalidUserPasswordError
 * @description
 * 잘못된 user password임.
 */
export const invalidUserPasswordError = new ApolloError('INVALID_USER_INFO', 'INVALID_USER_INFO');
/**
 * @name existUserEmailError
 * @description
 * 이미 존재하는 eamil임.
 */
export const existUserEmailError = new ApolloError('EXIST_USER_EMAIL', 'EXIST_USER_EMAIL');
/**
 * @name invalidRoomIdError
 * @description
 * 존재하지 않는 roomId임.
 */
export const invalidRoomIdError = new ApolloError('INVALID_ROOM_ID', 'INVALID_ROOM_ID');
/**
 * @name invalidRestaurantIdError
 * @description
 * 존재하지 않는 restaurant임.
 */
export const invalidRestaurantIdError = new ApolloError(
  'INVALID_RESTAURANT_ID',
  'INVALID_RESTAURANT_ID',
);
