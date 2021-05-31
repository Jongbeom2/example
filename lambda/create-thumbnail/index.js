const jimp = require("jimp");
const AWS = require("aws-sdk");
const s3Client = new AWS.S3();

const S3 = {
  async get(fileName, bucket) {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };
    let data = await s3Client.getObject(params).promise();
    if (!data) {
      throw Error(`Failed to get file ${fileName}, from ${bucket}`);
    }
    if (/\.json$/.test(fileName)) {
      data = JSON.parse(data.Body.toString());
    }
    return data;
  },
  async write(data, fileName, bucket, ACL, ContentType) {
    const params = {
      Bucket: `${bucket}-thumbnail`,
      Body: Buffer.isBuffer(data) ? data : JSON.stringify(data),
      Key: fileName,
      ACL,
      ContentType,
    };
    console.log("params", params);
    const newData = await s3Client.putObject(params).promise();
    if (!newData) {
      throw Error("there was an error writing the file");
    }
    return newData;
  },
};

exports.handler = async (event) => {
  console.log("##### start #####");
  console.log("event", JSON.stringify(event));
  const { Records } = event;

  try {
    const promArray = Records.map((record) => {
      const bucket = record.s3.bucket.name;
      const file = record.s3.object.key;
      const width = 200;
      const height = 200;
      return resizeImage({ bucket, file, width, height });
    });

    await Promise.all(promArray);

    console.log("##### end #####");
    return true;
  } catch (error) {
    console.log("error in try catch", error);
    return false;
  }
};

const resizeImage = async ({ bucket, file, width, height }) => {
  const imageBuffer = await S3.get(file, bucket);
  const jimpImage = await jimp.read(imageBuffer.Body);
  const mime = jimpImage.getMIME();

  const resizedImageBuffer = await jimpImage
    .resize(width, jimp.AUTO)
    .getBufferAsync(mime);
  const newFileName = file;
  await S3.write(resizedImageBuffer, newFileName, bucket, undefined, mime);
  return newFileName;
};
