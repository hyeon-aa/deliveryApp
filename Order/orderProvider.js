const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");


//주문정보 조회
exports.retrieveorderInfo = async function ([useridx,orderidx]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderInfoResult = await orderDao.selectorderInfo(connection,[useridx,orderidx]);

    connection.release();

    return orderInfoResult;
};

//주문정보 메뉴 조회
exports.retrieveorderInfomenu = async function ([useridx,orderidx]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderInfomenuResult = await orderDao.selectorderInfomenu(connection,[useridx,orderidx]);

    connection.release();

    return orderInfomenuResult;
};

//총 상세주문정보 조회
exports.retrieveorderInfotot = async function ([useridx,orderidx]) {
    const connection = await pool.getConnection(async (conn) => conn);


    const orderInfoResult = await orderDao.selectorderInfo(connection,[useridx,orderidx]);
    const orderInfomenuResult = await orderDao.selectorderInfomenu(connection,[useridx,orderidx]);

    connection.release();

    var orderInfototArray=new Array();
    orderInfototArray.push(orderInfoResult);
    orderInfototArray.push(orderInfomenuResult);
    return orderInfototArray
};


//장바구니 조회
exports.retrieveshoppingbasket = async function ( [useridx,basketidx]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const shoppingbasketResult = await orderDao.selectshoppingbasket(connection,  [useridx,basketidx]);

    connection.release();

    return shoppingbasketResult;
};

//장바구니 합계 조회
exports.retrieveshoppingbaskettot = async function ( [useridx,basketidx]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const shoppingbaskettotResult = await orderDao.selectshoppingbaskettot(connection,  [useridx,basketidx]);

    connection.release();

    return shoppingbaskettotResult;
};

//총 장바구니 조회
exports.retrieveshoppingbasketF = async function ( [useridx,basketidx]) {
    const connection = await pool.getConnection(async (conn) => conn);


    const shoppingbasketResult = await orderDao.selectshoppingbasket(connection,  [useridx,basketidx]);
    const shoppingbaskettotResult = await orderDao.selectshoppingbaskettot(connection,  [useridx,basketidx]);

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
