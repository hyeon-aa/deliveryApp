module.exports = function(app) {
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //장바구니 메뉴 등록
    app.post('/app/orders/basketmenu', jwtMiddleware, order.postbasketmenu);

    //*상세주문정보 조회
    app.get('/app/orders/Infodetail',jwtMiddleware, order.getorderInfo);

    //* 장바구니 조회
    app.get('/app/orders/basketdetail',jwtMiddleware, order.getshoppingbasket);

    //장바구니 전체 삭제
    app.patch('/app/orders/basketdetails/:useridx/status',jwtMiddleware, order.patchbasket);

    //장바구니 메뉴 삭제
    app.patch('/app/orders/basketmenu/:useridx/status',jwtMiddleware, order.patchbasketmenu);

    //장바구니 수정
    app.patch('/app/orders/basketinfo/:useridx',jwtMiddleware, order.patchbasketinfo);

    //카카오페이
    //app.post( '/app/orders/:basketidx/payorder', jwtMiddleware, order.payorder);

};