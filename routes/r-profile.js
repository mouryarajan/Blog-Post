const express = require('express');
const route = express.Router()
const isAuth = require('../handler/is-auth');

//Importing Controller 
const profileController = require('../controllers/c-profile');

//Routes
route.get('/profile', isAuth,profileController.getProfile);
route.get('/add-image', isAuth,profileController.getAddImage);
route.post('/add-image', isAuth,profileController.postAddImage);
route.get('/like/:txtImageId', isAuth,profileController.getLike);
route.get('/unlike/:txtImageId', isAuth,profileController.getUnLike);
route.get('/like/home/:txtImageId', isAuth,profileController.getLikeHome);
route.get('/unlike/home/:txtImageId', isAuth,profileController.getUnLikeHome);

module.exports = route;