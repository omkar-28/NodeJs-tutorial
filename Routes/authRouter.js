const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/all').get(authController.getAllusers)
router.route('/login').post(authController.login)

module.exports = router;