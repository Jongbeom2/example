import dotenv from 'dotenv';
import rootDir from 'app-root-path';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { connectDatabase } from 'src/middlewares/database';
import { startServer } from 'src/apollo/server';
import { environmentError } from 'src/error/ErrorObject';
import { initFirebase } from 'src/middlewares/firebase';
import { logger } from 'src/middlewares/winston';

process.stdout.write('\x1Bc');
logger.info(`Server Start`);
logger.info(`✔ Root directory is ${rootDir.path}`);
logger.info(`✔ Environment: ${process.env.NODE_ENV}`);

// production mode에서는 데이터 베이스를 연결하고 서버를 실행함.
// develoption mode에서는 동시에 데이터 베이스를 연결하고 서버를 실행함.
// 원래는 production mode처럼 하는게 맞는데, 개발 시 리로드 시간을 줄이기 위함.
if (process.env.NODE_ENV === 'production') {
  (async () => {
    await connectDatabase();
    initFirebase();
    startServer();
  })();
} else if (process.env.NODE_ENV === 'development') {
  connectDatabase();
  initFirebase();
  startServer();
} else {
  throw environmentError;
}
