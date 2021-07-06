const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storereviewDao = require("./storereviewDao");

exports.userIDCheck = async function (useridx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIDCCheckResult = await storereviewDao.selectUserID(connection, useridx);
    connection.release();

    return userIDCCheckResult;
};

exports.orderIDCheck = async function (orderidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderIDCCheckResult = await storereviewDao.selectOrderID(connection, orderidx);
    connection.release();

    return orderIDCCheckResult;
};

exports.userorderIDCheck = async function (useridx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userorderIDCheckResult = await storereviewDao.selectuserorderID(connection, useridx);
    connection.release();

    return userorderIDCheckResult;
};

//리뷰보드 조회
exports.retrievereviewBoard = async function ([storeidx,sort,page,size]) {
    const connection = await pool.getConnection(async (conn) => conn);

    const StorereviewBoardResult = await storereviewDao.selectStorereviewBoard(connection, [storeidx,sort,page,size]);

    connection.release();

    return StorereviewBoardResult;
};

//리뷰 댓글수 조회
exports.retrieveStorereviewcommentNum = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StorereviewcommentNumResult = await storereviewDao.selectreviewcommentNum(connection, storeidx);

    connection.release();

    return StorereviewcommentNumResult;
};

//리뷰 그래프 조회
exports.retrievereviewgraph = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const StorereviegraphResult = await storereviewDao.selectreviewgraph(connection, storeidx);

    connection.release();

    return StorereviegraphResult;
};