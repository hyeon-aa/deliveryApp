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

//음식점 대표메뉴
exports.retrievermenuStore = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storermenuResult = await storeDao.selectrmenuStoreidx(connection, storeidx);

    connection.release();

    return storermenuResult;
};

//음식점 메뉴 카테고리 조회
exports.retrievermenucategory = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menucategoryResult = await storeDao.selectmenucategory(connection, storeidx);

    connection.release();

    return menucategoryResult;
};

//카테고리별 메뉴 조회
exports.retrievemenubycategory = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menubycategoryResult = await storeDao.selectmenubycategory(connection, storeidx);


    connection.release();

    return menubycategoryResult;
};

//메뉴 원산지 조회
exports.retrievemenuorigin= async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuoriginResult = await storeDao.selectmenuorigin(connection, storeidx);


    connection.release();

    return menuoriginResult;
};

//최종 음식점메뉴 조회
exports.retrievemenuInfo = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storermenuResult = await storeDao.selectrmenuStoreidx(connection, storeidx);
    const menucategoryResult = await storeDao.selectmenucategory(connection, storeidx);
    const menubycategoryResult = await storeDao.selectmenubycategory(connection, storeidx);
    const menuoriginResult = await storeDao.selectmenuorigin(connection, storeidx);

    connection.release();

    var menuInfoArray=new Array();
    menuInfoArray.push(storermenuResult);
    menuInfoArray.push(menucategoryResult);
    menuInfoArray.push(menubycategoryResult);
    menuInfoArray.push(menuoriginResult);
    return menuInfoArray
};

/*
//주소에 따른 카테고리별 음식점 조회
exports.retrieveStorecategory = async function ([categoryidx,useridx]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storecategoryResult = await storeDao.selectcategorystoreidx(connection, [categoryidx,useridx]);

    connection.release();

   return storecategoryResult;
};
*/

//주소에 따른 카테고리별 음식점 조회2
exports.retrieveStorecategory = async function ([categoryidx,useridx,lat,long,sort,page,size]) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storecategoryResult = await storeDao.selectcategorystoreidx(connection, [categoryidx,useridx,lat,long,sort,page,size]);
    console.log('sort3',sort);
    connection.release();

    return storecategoryResult;
};



//음식점 상세정보 조회
exports.retrievestoredetail = async function (storeidx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storedetailResult = await storeDao.selectstoredetail(connection, storeidx);

    connection.release();

    return storedetailResult;
};

