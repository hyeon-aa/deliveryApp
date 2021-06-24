const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */

    require('../src/app/User/userRoute')(app);
    //require('../src/app/User/testRoute')(app);
    require('../src/app/Store/storeRoute')(app);
    require('../src/app/Search/searchRoute')(app);
    require('../src/app/Storereview/storereviewRoute')(app);
    require('../src/app/Order/orderRoute')(app);
    require('../src/app/Weather/weatherRoute')(app);//
    
    return app;
};
