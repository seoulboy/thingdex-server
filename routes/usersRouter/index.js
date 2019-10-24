var express = require('express');
var router = express.Router();
const roomsRouter = require('../roomsRouter');
const { ensureAuthenticated } = require('../../config/authentication');
const { handleGetUser, handlePutUser, handlePostUser } = require('../../controllers');


router.use('/:user_id/rooms', ensureAuthenticated, roomsRouter);

router.get('/:user_id', ensureAuthenticated, handleGetUser);

router.put('/:user_id', ensureAuthenticated, handlePutUser);

router.post('/', handlePostUser)
module.exports = router;
