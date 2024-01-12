const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

const s3UploadMultiple = async (files) => {
  const s3 = new S3();
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}.${file.extension}`,
      Body: file.buffer,
    };
  });

  const results = await Promise.all(
    params.map((param) => s3.upload(param).promise())
  );

  return results;
};

const s3UploadUnique = async (file) => {
  const s3 = new S3();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuid()}.${file.extension}`,
    Body: file.buffer,
  }


  const result = await s3.upload(params).promise();

  return result;
};

const s3DeleteFile = async (file) => {
  const s3 = new S3();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.key
  }
const result = await s3.deleteObject(params).promise();
return result
}


module.exports = {
  s3UploadMultiple,
  s3UploadUnique,
  s3DeleteFile
};
