const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");


//주문정보
exports.retrieveorderInfo = async function (orderidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderInfoResult = await orderDao.selectorderInfo(connection,orderidx);

    connection.release();

    return orderInfoResult;
};

//주문정보2
exports.retrieveorderInfomenu = async function (orderidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderInfomenuResult = await orderDao.selectorderInfomenu(connection,orderidx);

    connection.release();

    return orderInfomenuResult;
};

//주문정보합
exports.retrieveorderInfotot = async function (orderidx) {
    const connection = await pool.getConnection(async (conn) => conn);


    const orderInfoResult = await orderDao.selectorderInfo(connection,orderidx);
    const orderInfomenuResult = await orderDao.selectorderInfomenu(connection,orderidx);

    connection.release();

    var orderInfototArray=new Array();
    orderInfototArray.push(orderInfoResult);
    orderInfototArray.push(orderInfomenuResult);
    return orderInfototArray
};


//장바구니
exports.retrieveshoppingbasket = async function (basketidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const shoppingbasketResult = await orderDao.selectshoppingbasket(connection, basketidx);

    connection.release();

    return shoppingbasketResult;
};

//장바구니 합
exports.retrieveshoppingbaskettot = async function (basketidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const shoppingbaskettotResult = await orderDao.selectshoppingbaskettot(connection, basketidx);

    connection.release();

    return shoppingbaskettotResult;
};

//장바구니 최종
exports.retrieveshoppingbasketF = async function (basketidx) {
    const connection = await pool.getConnection(async (conn) => conn);


    const shoppingbasketResult = await orderDao.selectshoppingbasket(connection, basketidx);
    const shoppingbaskettotResult = await orderDao.selectshoppingbaskettot(connection, basketidx);

    connection.release();

    var shoppingbasketFArray=new Array();
    shoppingbasketFArray.push(shoppingbasketResult);
    shoppingbasketFArray.push(shoppingbaskettotResult);
    return shoppingbasketFArray
};

exports.userIDCheck = async function (useridx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIDCCheckResult = await orderDao.selectUserID(connection, useridx);
    connection.release();

    return userIDCCheckResult;
};