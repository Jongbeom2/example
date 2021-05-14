import AWS from 'aws-sdk';
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
};
AWS.config.update({ credentials, region: process.env.AWS_REGION });
const createStorageConnection = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
export default createStorageConnection;
