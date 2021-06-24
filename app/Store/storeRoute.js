module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //음식점 카테고리 리스트 조회
    app.get('/app/stores/storecategorylists', store.getstorecategoryList);

    //*가게상세 정보
    app.get('/app/stores/storedetails', store.getstoredetail);

    //*특정 음식점 조회
    app.get('/app/stores/:storeidx', store.getStoreidx);

    //특정 음식점 대표메뉴 조회
    app.get('/app/stores/:storeidx/rmenus', store.getrmenuStoreidx);

    //특정 음식점 메뉴 카테고리 조회
    app.get('/app/stores/:storeidx/menucategory', store.getmenucategory);

    //카테고리별 메뉴 조회 API
    app.get('/app/stores/:storeidx/menubycategory', store.getmenubycategory);

    //*최종 음식점 메뉴 조회 API
    app.get('/app/stores/:storeidx/menuinfos', store.getmenuInfo);

    //*음식점 원산지 조회 API
    app.get('/app/stores/:storeidx/menuorigin', store.getmenuorigin);

    //*주소에 따른 카테고리별 음식점 조회 API
    app.get('/app/stores',jwtMiddleware, store.getcategoryStoreidx);




};

