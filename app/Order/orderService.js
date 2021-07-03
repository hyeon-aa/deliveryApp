const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const orderProvider = require("./orderProvider");
const orderDao = require("./orderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");



// 장바구니 메뉴 등록
exports.createbasketmenu = async function (useridx,basketidx,menuidx,menudetailidx,menuquantity) {
    try {

        const menuRows = await orderProvider.menuIDCheck(menuidx);
        if (menuRows.length === 0)
            return errResponse(baseResponse.MENU_MENUID_NOT_EXIST);

        const insertbasketmenuParams = [useridx,basketidx,menuidx,menudetailidx,menuquantity];

        const connection = await pool.getConnection(async (conn) => conn);

        const basketmenuResult = await orderDao.insertbasketmenu(connection, insertbasketmenuParams);

        //최소주문금액 확인
        const basketRows = await orderProvider.basketminCheck(basketidx);
        console.log(basketRows);
        var bArray=new Array();
        for (var i = 0; i < basketRows.length; i++){
            bArray.push(basketRows[i].basketm,basketRows[i].orderamountmin)};
        console.log(bArray);

        connection.release();
        if ( bArray[0]<bArray[1]){
        return errResponse(baseResponse.BASKET_MIN)}
        else
            return response(baseResponse.BASKET_ORDER_SUCCESS );


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//장바구니 전체 삭제
exports.editbasket = async function (useridx, basketidx) {
    try {
        const basketRows = await orderProvider.basketIDCheck(basketidx);
        if (basketRows.length === 0)
            return errResponse(baseResponse.BASKET_BASKETIDX_NOT_EXIST);

        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editbasketResult = await orderDao.updatebasket(connection, useridx,  basketidx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//장바구니 메뉴 삭제
exports.editbasketmenu = async function (useridx, basketidx,menuidx,menudetailidx) {
    try {
        const basketRows = await orderProvider.basketIDCheck(basketidx);
        if (basketRows.length === 0)
            return errResponse(baseResponse.BASKET_BASKETIDX_NOT_EXIST);

        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editbasketmenuResult = await orderDao.updatebasketmenu(connection, useridx,  basketidx,menuidx,menudetailidx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//장바구니 수정
exports.editbasketinfo = async function (menuidx,menudetailidx,menuquantity,useridx,basketidx) {
    try {

        const basketRows = await orderProvider.basketIDCheck(basketidx);
       if (basketRows.length === 0)
            return errResponse(baseResponse.BASKET_BASKETIDX_NOT_EXIST);

        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editbasketinfoResult = await orderDao.updatebasketinfo(connection, menuidx,menudetailidx,menuquantity,useridx,basketidx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
