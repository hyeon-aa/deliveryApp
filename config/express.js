const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
const passport = require('passport');
var session = require('express-session');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true }
    }))

    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    require('../src/app/User/userRoute')(app);
    require('../src/app/Store/storeRoute')(app);
    require('../src/app/Search/searchRoute')(app);
    require('../src/app/Storereview/storereviewRoute')(app);
    require('../src/app/Order/orderRoute')(app);
    require('../src/app/Weather/weatherRoute')(app);//
    
    return app;
};
