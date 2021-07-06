const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");


//특정 음식점 정보 조회
exports.retrieveStore = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeResult = await storeDao.selectStoreidx(connection, storeidx);

    connection.release();

    return storeResult[0];
};

//음식점들 카테고리 리스트 조회
exports.retrievestorecategoryList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const storecategoryListResult = await storeDao.selectstorecategorylist(connection);

    connection.release();

    return storecategoryListResult;
};

//음식점메뉴 조회
exports.retrievemenuInfo = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storemenuResult = await storeDao.selectmenubyStoreidx(connection, storeidx);

    connection.release();

    return storemenuResult;
};


//주소에 따른 카테고리별 음식점 조회
exports.retrieveStorecategory = async function ([categoryidx,useridx,sort,page,size]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storecategoryResult = await storeDao.selectcategorystoreidx(connection, [categoryidx,useridx,sort,page,size]);

    connection.release();

   return storecategoryResult;
};


//주소에 따른 카테고리별 음식점 조회2(현재위치에따라서)
/*
exports.retrieveStorecategory = async function ([categoryidx,useridx,lat,long,sort,page,size]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storecategoryResult = await storeDao.selectcategorystoreidx(connection, [categoryidx,useridx,lat,long,sort,page,size]);
    console.log('sort3',sort);
    connection.release();

    return storecategoryResult;
};
*/


//음식점 상세정보 조회
exports.retrievestoredetail = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storedetailResult = await storeDao.selectstoredetail(connection, storeidx);

    connection.release();

    return storedetailResult;
};

