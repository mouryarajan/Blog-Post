const users = require('../models/m-user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
        message = message[0];
    }else{
        message=null;
    }
    res.render('login', ({
        pageTitle: "Login",
        errorMessage: message
    }))
}

exports.postLogin = async (req, res, next) => {
    const email = req.body.txtEmailId;
    const password = req.body.txtUserPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('login', ({
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg
        }))
    }
    data = await users.findOne({ email: email });
    if (data) {
        const validPassword = await bcrypt.compare(password, data.password);
        if (validPassword) {
            req.session.isLoggedIn = true;
            req.session.userId = data._id;
            req.session.name = data.name;
            res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    }else{
        req.flash('error', 'Invalid Credential');
        res.redirect('/login');
    }
}

exports.getRegister = (req, res, next) => {
    let message = req.flash('error-register');
    if(message.length>0){
        message = message[0];
    }else{
        message=null;
    }
    res.render('register', ({
        pageTitle: "Registration",
        errorMessage: message
    }))
}

exports.postRegister = async (req, res, next) => {
    const name = req.body.txtUserName;
    const email = req.body.txtEmailId;
    const password = req.body.txtUserPassword;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('register', ({
            pageTitle: "Registration",
            errorMessage: errors.array()[0].msg
        }))
    }
    if (email) {
        data = await users.findOne({ email: email });
        if (data) {
            req.flash('error-register', 'User already Exist with this Email Id');
            return res.redirect('/register');
        } else {
            const Users = new users({
                name: name,
                email: email,
                password: hashPassword
            });
            Users.save()
                .then(result => {
                    if (result) {
                        res.redirect('/login')
                    } else {

                    }
                }).catch(err => { console.log(err) });
        }
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
}