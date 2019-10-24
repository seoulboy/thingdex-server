const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { Room } = require('../models');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'thing-dex',
    acl: 'public-read',
    key: async (req, file, cb) => {
      if (req.body.location) {
        // add location pic
        const room = await Room.findById(req.params.room_id);
        cb(null, `${req.params.user_id}/${room.name}/locations/${req.body.location}`);
      } else {
        // add room pic
        cb(null, `${req.params.user_id}/${req.body.name}/${req.body.name}.${file.mimetype.replace('image/', '')}`);
      }
    },
  }),
});

module.exports = upload;
