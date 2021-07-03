module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //음식점 카테고리 리스트 조회
    app.get('/app/stores/storecategorylists', store.getstorecategoryList);

    //*가게상세 정보
    app.get('/app/stores/storedetails', store.getstoredetail);

    //*특정 음식점 조회
    app.get('/app/stores/:storeidx', store.getStoreidx);

    //*음식점 메뉴 조회 API
    app.get('/app/stores/:storeidx/menuinfos', store.getmenuInfo);

    //*주소에 따른 카테고리별 음식점 조회 API
    app.get('/app/stores',jwtMiddleware, store.getcategoryStoreidx);




};

