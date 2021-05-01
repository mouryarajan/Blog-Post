const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

//Database Connect URL Use this url to connect with database through MongodbCompass
const MONGODBURI = "mongodb+srv://coursecate:coursecate@clustersweetu.csmne.mongodb.net/blog?retryWrites=true&w=majority";

const bodyParser = require('body-parser');
const app = express();

//Session Configuration
const store = new MongoDBStore({
    uri: MONGODBURI,
    collection: 'sessions'
});

//File Storage Config
const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './assets/images')
    },
    filename: (req, file, cb) => {
        cb(null, Math.floor(100000 + Math.random() * 900000) + '-' + file.originalname);
    }
});

//Filter Multer
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//Setting Template Engine
app.set('view engine','ejs');
app.set('views', 'views');

//Importing Routes
const homeRoute = require('./routes/r-home');
const loginRoute = require('./routes/r-login');
const profileRoute = require('./routes/r-profile');

//Middleware
app.use(bodyParser.urlencoded({extended: true }));
app.use(multer({storage: fileStorage,fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname,'assets')));
app.use(
    session({
        secret:'my secrect', 
        resave: false, 
        saveUninitialized: false, 
        store: store})
);
app.use(flash());

//Route Middleware
app.use(homeRoute);
app.use(loginRoute);
app.use(profileRoute);

//404 Page
app.use('/',(req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

//Initializing Server
mongoose.connect(MONGODBURI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(result=>{
    app.listen(3000);
}).catch(err=>{
    console.log(err);
})


