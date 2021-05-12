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
 * @name AuthenticationError
 * @description
 * Login할 때 User가 존재하지 않는 경우
 * Login할 때 비밀번호 틀린 경우
 * Sigin up할 때 User가 존재하는 경우
 */
const autehnticationError = new AuthenticationError('Authentication Error');

/**
 * @name ForbiddenError
 * @description
 * 주어진 권한으로 접근할 수 없는 리소스에 접근한 경우
 */
const forbiddenError = new ForbiddenError('Forbidden Error');

/**
 * @name UserInputError
 * @description
 * 잘못된 Input이 들어온 경우 ex) input이 0~100이어야하는 경우 로직에서 처리하여 에러 발생
 * 단순히 Graghql에서 정의한 Schema에 맞지 않는 경우는 제외함 (이 경우는 알아서 처리해줌)
 */
const userInputError = new UserInputError('유저 인풋 에러');

/**
 * @name CustomError
 * @param {string} errorMessage
 * @param {string} errorCode
 * @param {string} errorProperties
 * @description
 * Error 포멧
 * 이 포멧에 맞춰서 에러 객체를 정의해야함
 */
const customError = new ApolloError('Custom Error', 'CUSTOM_ERROR', {
  customProperty: 'Custom Property',
});

const environmentError = new Error('Check environment: ' + process.env.NODE_ENV);

export { autehnticationError, forbiddenError, userInputError, customError, environmentError };
