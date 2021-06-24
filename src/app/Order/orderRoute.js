module.exports = function(app) {
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    //장바구니 메뉴 등록
    app.post('/app/orders/basketmenus', order.postbasketmenu);

//주문정보
    app.get('/app/orders/Infos', order.getorderInfo);

//주문정보 메뉴
    app.get('/app/orders/Infomenus', order.getorderInfomenu);

//*7.주문정보 합
    app.get('/app/orders/Infodetails', order.getorderInfotot);

//4. 장바구니조회
    app.get('/app/orders/baskets', order.getshoppingbasket);

//장바구니 합계 조회
    app.get('/app/orders/baskettotal', order.getshoppingbaskettot);

//*장바구니 최종
    app.get('/app/orders/basketdetails', order.getshoppingbasketF);

};