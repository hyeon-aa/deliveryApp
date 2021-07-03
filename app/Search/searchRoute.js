module.exports = function(app) {
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //검색순위
    app.get('/app/searches/rank',search.getsearchrank);

};