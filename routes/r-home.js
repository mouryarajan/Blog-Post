const express = require('express');
const router = express.Router();
const isAuth = require('../handler/is-auth');

//Importing Controller
const homeController = require('../controllers/c-home');

router.get('/home', isAuth,homeController.getHome);

module.exports = router;