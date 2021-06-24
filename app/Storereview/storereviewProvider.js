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


//리뷰보드
exports.retrieveStorereviewList = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StorereviewListResult = await storereviewDao.selectStorereviewList(connection, storeidx);

    connection.release();

    return StorereviewListResult;
};

//리뷰메뉴 추천 조회
exports.retrievereviewmenurecommend = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewmenurecommendResult = await storereviewDao.selectreviewmenurecommend(connection, storeidx);

    connection.release();

    return reviewmenurecommendResult;
};

//리뷰 이미지 조회
exports.retrievereviewimg = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewimgResult = await storereviewDao.selectreviewimg(connection, storeidx);

    connection.release();

    return reviewimgResult;
};

//리뷰보드 조회
exports.retrievereviewBoard = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const StorereviewListResult = await storereviewDao.selectStorereviewList(connection, storeidx);
    const reviewmenurecommendResult = await storereviewDao.selectreviewmenurecommend(connection, storeidx);
    const reviewimgResult = await storereviewDao.selectreviewimg(connection, storeidx);

    connection.release();

    var reviewBoardArray=new Array();
    reviewBoardArray.push(StorereviewListResult);
    reviewBoardArray.push(reviewmenurecommendResult);
    reviewBoardArray.push(reviewimgResult);
    return reviewBoardArray
};

//리뷰 댓글수 조회
exports.retrieveStorereviewcommentNum = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StorereviewcommentNumResult = await storereviewDao.selectreviewcommentNum(connection, storeidx);

    connection.release();

    return StorereviewcommentNumResult;
};

//리뷰 별점별 사람수 조회
exports.retrievereviewpeople = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StorereviewpeopleResult = await storereviewDao.selectreviewpeople(connection, storeidx);

    connection.release();

    return StorereviewpeopleResult;
};

//월별 리뷰 조회
exports.retrievemonthreview = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StoreremonthreviewResult = await storereviewDao.selectmonthreview(connection, storeidx);

    connection.release();

    return StoremonthreviewResult;
};

//총 평점 조회
exports.retrievetotalstar = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StoreretotalstarResult = await storereviewDao.selecttotalstar(connection, storeidx);

    connection.release();

    return StoreretotalstarResult;
};

//리뷰 그래프 조회
exports.retrievereviewgraph = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const StorereviewpeopleResult = await storereviewDao.selectreviewpeople(connection, storeidx);
    const StoreremonthreviewResult = await storereviewDao.selectmonthreview(connection, storeidx);
    const StoreretotalstarResult = await storereviewDao.selecttotalstar(connection, storeidx);

    connection.release();

    var reviewgraphArray=new Array();
    reviewgraphArray.push(StorereviewpeopleResult);
    reviewgraphArray.push(StoreremonthreviewResult);
    reviewgraphArray.push(StoreretotalstarResult);
    return reviewgraphArray
};