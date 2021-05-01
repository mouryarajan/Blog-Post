const express = require('express');
const route = express.Router();
const { check } = require('express-validator');

//Importing Controller
const loginController = require('../controllers/c-login');

route.get('/login', loginController.getLogin);

//Client Side Validation
route.post('/login', 
    check('txtEmailId').isEmail().withMessage('Please Enter A Valid Email!'), 
    loginController.postLogin
);

route.get('/register', loginController.getRegister);
//Client Side Validation
route.post(
    '/register', 
    [
    check('txtEmailId').isEmail().withMessage('Please Enter A Valid Email!'),
    check('txtUserPassword','Password Must Be Of Minimum 5 Character!')
    .isLength({min:5})
    ],
    loginController.postRegister
);

route.post('/logout', loginController.postLogout);

module.exports = route;