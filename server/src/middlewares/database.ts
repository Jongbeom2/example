import mongoose from 'mongoose';
import colors from 'colors';
import { environmentError } from 'src/error/ErrorObject';
mongoose.set('debug', true);
mongoose.connection
  .once('open', () => {
    console.log(`✔ MongoDB ready at ${colors.blue.bold(process.env.MONGO_URL ?? '')}`);
  })
  .on('connected', () => {
    console.log('✔ MongoDB Connection Established');
  })
  .on('reconnected', () => {
    console.log('✔ MongoDB Connection Reestablished');
  })
  .on('disconnected', () => {
    console.log('✔ MongoDB Connection Disconnected');
  })
  .on('close', () => {
    console.log('✔ MongoDB Connection Closed');
  })
  .on('error', (error) => {
    console.log('✔ MongoDB Connection Failed');
    console.error(error);
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
