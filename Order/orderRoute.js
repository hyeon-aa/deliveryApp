module.exports = function(app) {
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //장바구니 메뉴 등록
    app.post('/app/orders/basketmenus', jwtMiddleware, order.postbasketmenu);

//주문정보 조회
    app.get('/app/orders/Infos', jwtMiddleware,order.getorderInfo);

//주문정보 메뉴 조회
    app.get('/app/orders/Infomenus', jwtMiddleware,order.getorderInfomenu);

//*총 상세주문정보 조회
    app.get('/app/orders/Infodetails',jwtMiddleware, order.getorderInfotot);

//장바구니 조회
    app.get('/app/orders/baskets',jwtMiddleware, order.getshoppingbasket);

//장바구니 합계 조회
    app.get('/app/orders/baskettotal',jwtMiddleware, order.getshoppingbaskettot);

//*총 장바구니 조회
    app.get('/app/orders/basketdetails',jwtMiddleware, order.getshoppingbasketF);

    //장바구니 전체 삭제
    app.patch('/app/orders/basketdetails/:useridx/status',jwtMiddleware, order.patchbasket);

    //장바구니 메뉴 삭제
    app.patch('/app/orders/basketmenu/:useridx/status',jwtMiddleware, order.patchbasketmenu);

    //장바구니 수정
    app.patch('/app/orders/basketinfo/:useridx',jwtMiddleware, order.patchbasketinfo);

};