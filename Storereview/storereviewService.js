const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const storereviewProvider = require("./storereviewProvider");
const storereviewDao = require("./storereviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.createstorereview = async function (useridx,storeidx,orderidx,userstarRating,usercomment) {
    try {

        const orderRows = await storereviewProvider.orderIDCheck(orderidx);
        if (orderRows.length === 0)
            return errResponse(baseResponse.ORDER_ORDERID_NOT_EXIST);

        const userorderRows = await storereviewProvider.userorderIDCheck(useridx);
        console.log('1',userorderRows[1]);
        console.log('2',userorderRows[1].orderidx);
        console.log('4',Object.values(orderidx));
        console.log('5',Object.values(userorderRows));
        userorderRows.forEach(element => console.log('6',element));
        //console.log('5',Object.values(userorderRows.orderidx));


        var rArray=new Array();
        for (var i = 0; i < userorderRows.length; i++){
            rArray.push(userorderRows[i].orderidx)};
        console.log(rArray);

        if (rArray.includes(orderidx)=== false)
            return errResponse(baseResponse.USER_USERORDERIDX_NOT_EXIST);

        const insertstorereviewParams = [useridx,storeidx,orderidx,userstarRating,usercomment];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await storereviewDao.insertstorereview(connection, insertstorereviewParams);
        //console.log(`추가된 리뷰 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//리뷰 삭제
exports.editreview = async function (useridx,reviewidx) {
    try {
        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editreviewResult = await storereviewDao.updateReview(connection,useridx,reviewidx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//리뷰 수정
exports.editreviewcontent = async function (userstarRating,usercomment,useridx,reviewidx) {
    try {
        console.log(useridx,usercomment)
        const connection = await pool.getConnection(async (conn) => conn);
        const editreviewcontentResult = await storereviewDao.updateReviewcontent(connection,userstarRating,usercomment,useridx,reviewidx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};