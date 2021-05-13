import cors from 'cors';
import colors from 'colors';
import { environmentError } from 'src/error/ErrorObject';

const allowedOrigins: string[] = [];

const corsMiddleware = () =>
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else if (process.env.NODE_ENV === 'production') {
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error('origin:', colors.blue.bold(origin ?? ''));
          callback(new Error('CORS violation: Not allowed request origin'));
          // ⛔ 배포 테스트 너무 불편해서 항상 cros에러 안나도록 설정하고 싶은 경우
          // callback(null, true);
        }
      } else {
        throw environmentError;
      }
    },
    credentials: true,
  });

export default corsMiddleware;