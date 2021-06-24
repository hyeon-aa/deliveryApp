const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

//주문정보 조회
exports.getorderInfo= async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfoByUserId = await orderProvider.retrieveorderInfo([useridx,orderidx]);
    return res.send(response(baseResponse.SUCCESS, orderInfoByUserId));
};

//주문정보 메뉴 조회
exports.getorderInfomenu= async function (req, res) {

   
    const useridx = req.verifiedToken.useridx ;
    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfomenuByUserId = await orderProvider.retrieveorderInfomenu([useridx,orderidx]);
    return res.send(response(baseResponse.SUCCESS, orderInfomenuByUserId));
};

//총 상세주문정보
exports.getorderInfotot= async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfototByUserId = await orderProvider.retrieveorderInfotot([useridx,orderidx]);
    return res.send(response(baseResponse.ORDERINFOTOT_SUCCESS, orderInfototByUserId));
};


//장바구니 조회
exports.getshoppingbasket = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const basketidx = req.query.basketidx;


    if (!basketidx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const shoppingbasketByUserId = await orderProvider.retrieveshoppingbasket( [useridx,basketidx]);
    return res.send(response(baseResponse.SUCCESS,shoppingbasketByUserId));
};

//장바구니 합계 조회
exports.getshoppingbaskettot = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const basketidx = req.query.basketidx;


    if (!basketidx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const shoppingbaskettotByUserId = await orderProvider.retrieveshoppingbaskettot( [useridx,basketidx]);
    return res.send(response(baseResponse.SUCCESS,shoppingbaskettotByUserId));
};

//총 장바구니 조회
exports.getshoppingbasketF = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const basketidx = req.query.basketidx;


    if (!basketidx) return res.send(errResponse(baseResponse.BASKET_BASKETIDX_EMPTY));

    const shoppingbasketFByUserId = await orderProvider.retrieveshoppingbasketF( [useridx,basketidx]);
    return res.send(response(baseResponse.BASKETF_SUCCESS,shoppingbasketFByUserId));
};


//장바구니 메뉴 등록
exports.postbasketmenu = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const {basketidx,menuidx,menudetailidx,menuquantity} = req.body;

    // 빈 값 체크

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

//장바구니 전체 삭제
exports.patchbasket = async function (req, res) {


    const userIdFromJWT = req.verifiedToken.useridx

    const  useridx= req.params.useridx;
    const basketidx = req.body.basketidx;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!basketidx) return res.send(errResponse(baseResponse. BASKET_BASKETIDX_EMPTY));

        const editbasket = await orderService.editbasket(useridx, basketidx)
        return res.send(editbasket);
    }
};

//장바구니 메뉴 삭제
exports.patchbasketmenu = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.useridx

    const useridx= req.params.useridx;
    const basketidx = req.body.basketidx;
    const menuidx = req.body.menuidx;
    const menudetailidx = req.body.menudetailidx;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!basketidx) return res.send(errResponse(baseResponse. BASKET_BASKETIDX_EMPTY))
        if (!menuidx) return res.send(errResponse(baseResponse. MENU_MENUIDX_EMPTY))
        if (!menudetailidx) return res.send(errResponse(baseResponse. MENU_MENUDETAILIDX_EMPTY));

        const editbasketmenu= await orderService.editbasketmenu(useridx, basketidx,menuidx,menudetailidx)
        return res.send(editbasketmenu);
    }
};

//장바구니 메뉴 수정
exports.patchbasketinfo= async function (req, res) {


    const userIdFromJWT = req.verifiedToken.useridx

    const useridx= req.params.useridx;
    const menuidx = req.body.menuidx;
    const menudetailidx = req.body.menudetailidx;
    const menuquantity = req.body.menuquantity;
    const basketidx = req.body.basketidx;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!basketidx) return res.send(errResponse(baseResponse. BASKET_BASKETIDX_EMPTY))
        if (!menuidx) return res.send(errResponse(baseResponse. MENU_MENUIDX_EMPTY))
        if (!menudetailidx) return res.send(errResponse(baseResponse. MENU_MENUDETAILIDX_EMPTY));
        if (!menuquantity) return res.send(errResponse(baseResponse. MENU_MENUQUANTITY_EMPTY));

        const editbasketinfo= await orderService.editbasketinfo(menuidx,menudetailidx,menuquantity,useridx,basketidx)
        return res.send(editbasketinfo);
    }
};