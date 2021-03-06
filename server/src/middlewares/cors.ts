import cors from 'cors';
import { corsError, environmentError } from 'src/error/ErrorObject';
import { logger } from 'src/middlewares/winston';

const allowedOrigins: string[] = ['http://example.jongbeom.com'];

const corsMiddleware = () =>
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else if (process.env.NODE_ENV === 'production') {
        if (!origin || (origin && allowedOrigins.includes(origin))) {
          callback(null, true);
        } else {
          logger.error(`origin: ${origin ?? ''}`);
          callback(corsError);
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
