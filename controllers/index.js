const userController = require('./userController');
const roomController = require('./roomController');
const authController = require('./authController');

module.exports = { ...userController, ...roomController, ...authController };
