const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (useremail) {
  if (!useremail) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, useremail);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserID(connection, useridx);

  connection.release();

  return userResult[0];
};


//찜한가게
exports.retrieveUserlikestore = async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userlikestoreResult = await userDao.selectlikestore(connection, useridx);

  connection.release();

  return userlikestoreResult;
};

//찜한가게 상태
exports.retrieveUserlikestorestatus = async function (useridx,storeidx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userlikestorestatusResult = await userDao.selectuserlikestorestatus(connection,useridx,storeidx);
  console.log(userlikestorestatusResult);

  connection.release();

  return userlikestorestatusResult;
};

//주문내역
exports.retrieveorderlist = async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const orderlistResult = await userDao.selectorderlist(connection, useridx);

  connection.release();

  return orderlistResult;
};


//유저 쿠폰 조회
exports.retrieveusercoupon= async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const usercouponResult = await userDao.selectusercoupon(connection, useridx);

  connection.release();

  return usercouponResult;
};

//유저 주소 조회
exports.retrieveuseraddress= async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const useraddressResult = await userDao.selectuseraddress(connection, useridx);
  console.log('6',useraddressResult);

  connection.release();

  return useraddressResult;
};

//유저 포인트 조회
exports.retrieveuserpoint= async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userpointResult = await userDao.selectuserpoint(connection, useridx);

  connection.release();

  return userpointResult;
};

//유저 검색내역 조회
exports.retrieveusersearch= async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const usersearchResult = await userDao.selectsearchlist(connection, useridx);

  connection.release();

  return usersearchResult;
};

//내가 쓴 리뷰 정보 조회
exports.retrievemyreviewInfo= async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myreviewResult = await userDao.selectmyreview(connection, useridx);

  connection.release();

  return myreviewResult;

};

exports.emailCheck = async function (useremail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, useremail);
  connection.release();

  return emailCheckResult;
};

exports.userIDCheck = async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIDCCheckResult = await userDao.selectUserID(connection, useridx);
  connection.release();

  return userIDCCheckResult;
};

exports.orderIDCheck = async function (orderidx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const orderIDCheckResult = await userDao.selectorderID(connection, orderidx);
  connection.release();

  return orderIDCheckResult;
};

exports.userorderIDCheck = async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userorderIDCheckResult = await userDao.selectuserorderID(connection, useridx);
  connection.release();

  return userorderIDCheckResult;
};


exports.storeIDCheck = async function (storeidx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const storeIDCheckResult = await userDao.selectstoreID(connection, storeidx);
  connection.release();

  return storeIDCheckResult;
};

exports.couponIDCheck = async function (couponidx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const couponIDCheckResult = await userDao.selectcouponidx(connection, couponidx);
  connection.release();

  return couponIDCheckResult;
};

exports.baseaddressCheck = async function (useridx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const baseaddressCheckResult = await userDao.selectbaseaddress(connection, useridx);
  connection.release();

  return baseaddressCheckResult;
};


exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (useremail) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, useremail);
  connection.release();

  return userAccountResult;

};