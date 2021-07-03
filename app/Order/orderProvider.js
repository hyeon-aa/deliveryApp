const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");

//상세주문정보 조회
exports.retrieveorderInfo = async function ([useridx,orderidx]) {
    const connection = await pool.getConnection(async (conn) => conn);

    const orderInfoResult = await orderDao.selectorderInfo(connection,[useridx,orderidx]);

    connection.release();

    return orderInfoResult;
};


//총 장바구니 조회
exports.retrieveshoppingbasket = async function ( [useridx,basketidx]) {
    const connection = await pool.getConnection(async (conn) => conn);

    const shoppingbasketResult = await orderDao.selectshoppingbasket(connection,[useridx,basketidx]);

    console.log(shoppingbasketResult);
    connection.release();

    return shoppingbasketResult;
};

exports.userIDCheck = async function (useridx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIDCCheckResult = await orderDao.selectUserID(connection, useridx);
    connection.release();

    return userIDCCheckResult;
};

exports.basketIDCheck = async function (basketidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const basketIDCheckResult = await orderDao.selectbasketID(connection, basketidx);
    connection.release();

    return basketIDCheckResult;
};

exports.basketminCheck = async function (basketidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const basketIDCheckResult = await orderDao.selectbasketmin(connection, basketidx);
    connection.release();

    return basketIDCheckResult;
};

exports.menuIDCheck = async function (menuidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuIDCheckResult = await orderDao.selectmenuID(connection, menuidx);
    connection.release();

    return menuIDCheckResult;
};
