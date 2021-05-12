import AWS from 'aws-sdk';
AWS.config.update({ region: process.env.AWS_REGION });
const createStorageConnection = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
export default createStorageConnection;
