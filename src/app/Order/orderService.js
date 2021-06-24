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
        const userRows = await orderProvider.userIDCheck(useridx);
        if (userRows.length === 0)
            return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        const insertbasketmenuParams = [useridx,basketidx,menuidx,menudetailidx,menuquantity];

        const connection = await pool.getConnection(async (conn) => conn);

        const basketmenuResult = await orderDao.insertbasketmenu(connection, insertbasketmenuParams);
        //console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};