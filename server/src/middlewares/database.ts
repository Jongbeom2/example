import mongoose from 'mongoose';
import colors from 'colors';
import { environmentError } from 'src/error/ErrorObject';
import { logger } from 'src/middlewares/winston';
mongoose.set('debug', true);
mongoose.connection
  .once('open', () => {
    logger.info(`✔ MongoDB ready at ${process.env.MONGO_URL ?? ''}`);
  })
  .on('connected', () => {
    logger.info('✔ MongoDB Connection Established');
  })
  .on('reconnected', () => {
    logger.info('✔ MongoDB Connection Reestablished');
  })
  .on('disconnected', () => {
    logger.info('✔ MongoDB Connection Disconnected');
  })
  .on('close', () => {
    logger.info('✔ MongoDB Connection Closed');
  })
  .on('error', (error) => {
    logger.info('✔ MongoDB Connection Failed');
    logger.error(error);
  });

let _db: typeof mongoose; // database client

export const connectDatabase = async () => {
  if (!process.env.MONGO_URL) {
    throw environmentError;
  }
  const mongooseObject = await mongoose.connect(process.env.MONGO_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    // useMongoClient: true,
  });
  _db = mongooseObject;
  return mongooseObject;
};

export const getDatabaseClient = () => _db;
