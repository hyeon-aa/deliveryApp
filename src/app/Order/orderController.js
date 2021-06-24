const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

//주문정보 조회
exports.getorderInfo= async function (req, res) {

    /**
     * Path Variable: userId
     */
    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfoByUserId = await orderProvider.retrieveorderInfo(orderidx);
    return res.send(response(baseResponse.SUCCESS, orderInfoByUserId));
};

//주문정보 조회2
exports.getorderInfomenu= async function (req, res) {

    /**
     * Path Variable: userId
     */

    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfomenuByUserId = await orderProvider.retrieveorderInfomenu(orderidx);
    return res.send(response(baseResponse.SUCCESS, orderInfomenuByUserId));
};

//주문정보 tot
exports.getorderInfotot= async function (req, res) {

    /**
     * Path Variable: userId
     */

    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfototByUserId = await orderProvider.retrieveorderInfotot(orderidx);
    return res.send(response(baseResponse.ORDERINFOTOT_SUCCESS, orderInfototByUserId));
};


//장바구니 조회
exports.getshoppingbasket = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const basketidx = req.query.basketidx;

    if (!basketidx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const shoppingbasketByUserId = await orderProvider.retrieveshoppingbasket(basketidx);
    return res.send(response(baseResponse.SUCCESS,shoppingbasketByUserId));
};

//장바구니 합계 조회
exports.getshoppingbaskettot = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const basketidx = req.query.basketidx;

    if (!basketidx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const shoppingbaskettotByUserId = await orderProvider.retrieveshoppingbaskettot(basketidx);
    return res.send(response(baseResponse.SUCCESS,shoppingbaskettotByUserId));
};

//장바구니 최종
exports.getshoppingbasketF = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const basketidx = req.query.basketidx;

    if (!basketidx) return res.send(errResponse(baseResponse.BASKET_BASKETIDX_EMPTY));

    const shoppingbasketFByUserId = await orderProvider.retrieveshoppingbasketF(basketidx);
    return res.send(response(baseResponse.BASKETF_SUCCESS,shoppingbasketFByUserId));
};


//장바구니 메뉴 등록
exports.postbasketmenu = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {useridx,basketidx,menuidx,menudetailidx,menuquantity} = req.body;

    // 빈 값 체크
    if (!useridx)
        return res.send(response(baseResponse.USER_USERID_EMPTY));

    if (!basketidx)
        return res.send(response(baseResponse.BASKET_BASKETIDX_EMPTY));

    if (!menuidx)
        return res.send(response(baseResponse.MENU_MENUIDX_EMPTY ));

    if (!menudetailidx)
        return res.send(response(baseResponse.MENU_MENUDETAILIDX_EMPTY));

    if (!menuquantity)
        return res.send(response(baseResponse.MENU_MENUQUANTITY_EMPTY));

    const signUpResponse = await orderService.createbasketmenu(
        useridx,basketidx,menuidx,menudetailidx,menuquantity
    );

    console.log("postbasketmenu");
    return res.send(signUpResponse);
};

