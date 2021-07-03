const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const secret_config = require("../../../config//secret");

const axios = require("axios");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");

//상세주문정보
exports.getorderInfo= async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const orderidx = req.query.orderidx;

    if (!orderidx) return res.send(errResponse(baseResponse.ORDER_ORDERIDX_EMPTY));

    const orderInfoByUserId = await orderProvider.retrieveorderInfo([useridx,orderidx]);
    return res.send(response(baseResponse.ORDERINFOTOT_SUCCESS, orderInfoByUserId));
};



//총 장바구니 조회
exports.getshoppingbasket = async function (req, res) {

    const useridx = req.verifiedToken.useridx ;
    const basketidx = req.query.basketidx;

    if (!basketidx) return res.send(errResponse(baseResponse.BASKET_BASKETIDX_EMPTY));

    const shoppingbasketByUserId = await orderProvider.retrieveshoppingbasket([useridx,basketidx]);
    return res.send(response(baseResponse.BASKETF_SUCCESS,shoppingbasketByUserId));
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

//카카오페이
/*
exports.payorder = async function (req, res) {

const useridx = req.verifiedToken.useridx;
const basketidx = req.params.basketidx;
const header = `KakaoAK ${secret_config.KAKAO_ADMIN_KEY}`;
const api_url = `https://kapi.kakao.com/v1/payment/ready`;
const cid = "TC0ONETIME";

//const orderInfoResult = await orderProvider.retrieveorderInfotot([useridx,orderidx]);
// console.log('order',orderInfoResult[0]);
// var resultArray = Object.values(JSON.parse(JSON.stringify(orderInfoResult)));
// console.log('order3',orderInfoResult[0][0].storename);
// console.log('order2',resultArray);
const basketInfoResult = await orderProvider.retrieveshoppingbasket([useridx,basketidx]);
const baskettotResult = await orderProvider.retrieveshoppingbaskettot ([useridx,basketidx]);
console.log(basketInfoResult);
console.log(baskettotResult);

axios({
    url: api_url,
    method: "post",
    headers: {
        Authorization: header,
    },
    params: {
        cid: cid,
        partner_order_id:
        partner_user_id: useridx,
        item_name:
        quantity: 1,
        total_amount: baskettotResult.baskettotal,
        tax_free_amount: 0,
        approval_url: `http://localhost:3000/app/orders/success`,
        cancel_url: 'http://localhost:3000/app/orders/cancel',
        fail_url: 'http://localhost:3000/app/orders/fail'
    },
})
    .then(function (response){
        console.log(response.data);
        pay=response.data.next_redirect_pc_url;
        console.log('pay',pay);
    })
    .catch((err) => {
       console.log(err);
    });
    return res.send(pay);
};
*/