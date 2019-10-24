const express = require('express');
const router = express.Router();
const upload = require('../../services/file-upload');

const { domain } = require('../../constants');
const CLIENT_HOME_PAGE_URL = `http://${domain}:3000`;

const aws = require('aws-sdk');

router.post('/', upload.single('image'), (req, res, next) => {
  console.log('uploadRouter, USERID: ', req.body.userId);
  console.log(
    'FILE KEY: ',
    req.file.key,
    'FILE LOCATION: ',
    req.file.location,
    'FILE ETAG: ',
    req.file.etag
  );
});

module.exports = router;
