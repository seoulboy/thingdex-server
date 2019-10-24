const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const bucket = 'thing-dex';

module.exports = async function emptyS3Directory(
  userId,
  roomName,
  locationName
) {
  if (!locationName) {
    const directory = `${userId}/${roomName}/`;

    const listParams = {
      Bucket: bucket,
      Prefix: directory,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(userId, roomName);
  } else if (locationName) {
    console.log('deleting location', locationName);
    s3.deleteObject(
      {
        Bucket: bucket,
        Key: `${userId}/${roomName}/locations/${locationName}`,
      },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log('deleted location');
      }
    );
  }
};
