const express=require('express');
const handlebar=require('express-handlebars');
const path=require('path');
const cors=require('cors');
const passport=require('passport');
const cookie=require('cookie-session');
const multer = require('multer');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const moment = require('moment');
const json2xls = require('json2xls');

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// const firebaseConfig = {
//     apiKey: "AIzaSyCjsF71xZGSmOsdTWV6trdU-EbjWkOthc4",
//     authDomain: "godigit-e73ff.firebaseapp.com",
//     projectId: "godigit-e73ff",
//     storageBucket: "godigit-e73ff.appspot.com",
//     messagingSenderId: "159640239283",
//     appId: "1:159640239283:web:a03114f31f2a3e1e2804c6",
//     measurementId: "G-31VPZY5KTQ"
//   };
  
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null,profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._json.email);
});

passport.deserializeUser(function(user, done) {
    done(null,user);
});

const app=express();

const hbs = handlebar.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/pieces'),
    helpers: {
        increment: function(value){
            return parseInt(value) + 1
        },
        decrement: function(value){
            return parseInt(value) - 1
        },
        select: function( selected, options ){
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        },
        selectRadio: function( selected, options ){
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& checked');
        },
        ifEquals: function(arg1, arg2){
            return (arg1 == arg2) ? true : false;
        },
        ifNotEquals: function(arg1, arg2){
            return (arg1 !== arg2) ? true : false;
        },
        nTimes: function(n, block){
            var accum = '';
            for(var i = 1; i <= n; ++i)
                accum += block.fn(i);
            return accum;
        },
        formatIndex: function(index)  {
            return index+1;
        },
        tableSerialNumber: function(currentPage, index)  {
            return (currentPage-1)*10+index+1;
        },
        for: function(from, to, incr, block) {
            var accum = '';
            for(var i = from; i <= to; i += incr)
                accum += block.fn(i);
            return accum;
        },
        leftNumberFormula: function(currentPage, totalPages) {
            return currentPage - 10 < 1 ? 1 : currentPage - 10
        },
        rightNumberFormula: function(currentPage, totalPages) {
            return currentPage + 10 < totalPages ? currentPage + 10 : totalPages
        },
        istDateTime: function(dateTime)  {
            return moment(dateTime).utcOffset("+05:30").format('MMMM Do YYYY, hh:mm:ss a');;
        },
        stringifyJson: function(data) {
            return JSON.stringify(data);
        },
        greaterThan: function(num, compare){
            return num > compare ? true : false;
        },
        lessThan: function(num, compare){
            return num < compare ? true : false;
        }

    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.enable('view cache');

app.use(cors());
app.use(express.json());
app.use(multer().any());
app.use(express.urlencoded({
    extended: false
  }));
app.use(express.static('public'))
app.use(express.static('files'))
app.use(json2xls.middleware);

app.use(cookie({
    name:'tuto-session',
    keys:['key1','key2']
}));

app.use(passport.initialize());
app.use(passport.session());

app.listen(3000);

module.exports ={
    app
}