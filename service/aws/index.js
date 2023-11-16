const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { env } = require("../../config/keys");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

function generateUUIDKeys(count) {
  const uuidKeys = [];

  for (let i = 0; i < count; i++) {
    const uuid = uuidv4();
    const code = uuid.replace(/-/g, "");
    uuidKeys.push(code);
  }

  return uuidKeys;
}
const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
};

const putObjectUrl = async (filename, username) => {
  const uuid=generateUUIDKeys(1)  
  const location = `${username}/${filename}-${uuid[0]}`;
  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: location,
  });

  const put_pre_signed_url = await getSignedUrl(s3Client, command);
  return {put_pre_signed_url,key:location};
};

const multipleSignedUrls = async (file_count, username) => {
  const keys = generateUUIDKeys(file_count);

  const promises = keys.map(async (key) => {
    const location = `${username}/${key}`;
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: location,
    });

    const put_pre_signed_url = await getSignedUrl(s3Client, command);
    // const file_url = await getObjectUrl(location);

    return { put_pre_signed_url,key:location,a:env.AWS_ACCESS_KEY,s:env.AWS_SECRET_ACCESS_KEY};
  });

  const urls = await Promise.all(promises);

  return urls;
};

const listFolder = async (folderPath) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: env.AWS_BUCKET,
      Prefix: folderPath + "/",
    });
    const response = await s3Client.send(command);

    if (response.Contents) {
      return response.Contents;
    } else return [];
  } catch (error) {
    console.error("Error in aws listFolder");
    throw error;
  }
};

const deleteFolder = async (foldertoDelete) => {
  try {
    const items = await listFolder(foldertoDelete);

    const filteredKeys = [];
    for (const item of items) {
      filteredKeys.push({
        Key: item.Key,
      });
    }

    if (filteredKeys.length > 0) {
      const Deletecommand = new DeleteObjectsCommand({
        Bucket: env.AWS_BUCKET,
        Delete: {
          Objects: filteredKeys,
        },
      });

      const res = await s3Client.send(Deletecommand);
      return { count: res.Deleted.length };
    } else return { count: 0 };
  } catch (error) {
    console.error("Error in aws deleteFolder");
    throw error;
  }
};

const deleteObject = async (key) => {
  console.log("aws",key);  
  try {
    const Deletecommand = new DeleteObjectsCommand({
      Bucket: env.AWS_BUCKET,
      Delete: {
        Objects: [{ Key: key }],
      },
    });
    const res = await s3Client.send(Deletecommand);
    return { count: res.Deleted.length };
  } catch (error) {
    console.error("Error in aws deleteObject");
    throw error;
  }
};

const makeEmptyFolder = async () => {
  try {
    const location = `abhi/`;
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: location,
    });

    const res=await s3Client.send(command)
    console.log(res);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getObjectUrl,
  putObjectUrl,
  multipleSignedUrls,
  deleteObject,
  deleteFolder,
  listFolder,
  makeEmptyFolder
};
