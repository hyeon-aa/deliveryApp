const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const axios = require("axios");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (useremail ,username,userphoneNum,birthday,userpassword) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(useremail);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userpassword)
            .digest("hex");

        const insertUserInfoParams = [useremail ,username,userphoneNum,birthday,userpassword];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//가게 찜 등록
exports.createlikestore = async function (useridx,storeidx) {
    try {

        const storeRows = await userProvider.storeIDCheck(storeidx);
        if (storeRows.length === 0)
            return errResponse(baseResponse. STORE_STOREID_NOT_EXIST);

        const insertlikestoreParams = [useridx,storeidx];

        const connection = await pool.getConnection(async (conn) => conn);

        const likestoreResult = await userDao.insertlikestore(connection, insertlikestoreParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//유저 주소 등록
/*
exports.createaddress = async function (useridx,useraddress,dongname,latitude,longitude,base) {
    try {

        const baseaddressRows = await userProvider.baseaddressCheck(useridx);
        if (baseaddressRows.length === 1 && base===0)
            return errResponse(baseResponse. BASEADDRESS_ONLY_ONE);

        const insertuseraddressParams = [useridx,useraddress,dongname,latitude,longitude,base];

        const connection = await pool.getConnection(async (conn) => conn);

        const useraddressResult = await userDao.insertuseraddress(connection, insertuseraddressParams);

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
*/

//유저 주소 등록2
exports.createaddress = async function (useridx,useraddress,dongname,latitude,longitude,base) {
    try {

        const baseaddressRows = await userProvider.baseaddressCheck(useridx);
        if (baseaddressRows.length === 1 && base===0)
            return errResponse(baseResponse. BASEADDRESS_ONLY_ONE);

        const insertuseraddressParams = [useridx,useraddress,dongname,latitude,longitude,base];

        const connection = await pool.getConnection(async (conn) => conn);

        const useraddressResult = await userDao.insertuseraddress(connection, insertuseraddressParams);

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};



//포인트 사용
exports.createpointuse = async function (useridx,orderidx,pointuse) {
    try {
        const userorderRows = await userProvider.userorderIDCheck(useridx);
        /*for (var i = 0; i < userorderRows.length; i++) {
            if (userorderRows[i].orderidx !== orderidx)
                return errResponse(baseResponse.ORDER_ORDERID_NOT_EXIST);
        };*/
        console.log(userorderRows[1]);

        var mArray=new Array();
        for (var i = 0; i < userorderRows.length; i++){
        mArray.push(userorderRows[i].orderidx)};
        console.log(mArray);

        if (mArray.includes(orderidx)=== false)
            return errResponse(baseResponse.USER_USERORDERIDX_NOT_EXIST);

            const insertpointuseParams = [useridx, orderidx, pointuse];

            const connection = await pool.getConnection(async (conn) => conn);

            const pointuseResult = await userDao.insertpointuse(connection, insertpointuseParams);
            connection.release();
            return response(baseResponse.SUCCESS);

        }catch(err){
            logger.error(`App - createUser Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }

};

//포인트 적립
exports.createpointsave = async function (useridx,orderidx) {
    try {

        const orderRows = await userProvider.orderIDCheck(orderidx);
        if (orderRows.length === 0)
            return errResponse(baseResponse. ORDER_ORDERID_NOT_EXIST);

        const insertpointsaveParams = [useridx,orderidx];

        const connection = await pool.getConnection(async (conn) => conn);

        const pointsaveResult = await userDao.insertpointsave(connection, insertpointsaveParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


//검색 내용 등록
exports.createsearchcontent = async function (useridx,searchcontent) {
    try {

        const insertsearchcontentParams = [useridx,searchcontent];

        const connection = await pool.getConnection(async (conn) => conn);

        const searchcontentResult = await userDao.insertsearchcontent(connection, insertsearchcontentParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//유저 쿠폰 등록
exports.createnewcoupon = async function (useridx,couponidx) {
    try {

        const couponRows = await userProvider.couponIDCheck(couponidx);
        if (couponRows.length === 0)
            return errResponse(baseResponse.COUPON_COUPONIDX_NOT_EXIST);

        const insertusercouponParams = [useridx,couponidx];

        const connection = await pool.getConnection(async (conn) => conn);

        const usercouponResult = await userDao.insertusercoupon(connection, insertusercouponParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (useremail, userpassword) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(useremail);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].useremail
        console.log('이메일', useremail);

       // const userInfoRows = await userProvider.accountCheck(useremail)
       // console.log('id확인', userInfoRows[0].useridx);
       // const selectId = userInfoRows[0].useridx

        //비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userpassword)
            .digest("hex");
        console.log('암호화비번', hashedPassword);
        console.log('비번', userpassword);

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        console.log('값',selectUserPasswordParams)
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        //console.log('비밀번호', passwordRows[0].userpassword);
        console.log('이', passwordRows[0]);

        if (passwordRows[0].userpassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
            console.log('실패');
        }

        // 계정 상태 확인

         const userInfoRows = await userProvider.accountCheck(useremail)
         console.log('id확인',userInfoRows[0].useridx);
         const selectId=userInfoRows[0].useridx

        if (userInfoRows[0].status === 1) {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 2){
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

            console.log(userInfoRows[0].useridx); // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                useridx: userInfoRows[0].useridx
               // userEmail: userInfoRows[0].useremail
               // username: userInfoRows[0].username
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        console.log(token)
        return response(baseResponse.SUCCESS, {'useridx': userInfoRows[0].useridx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (useridx, username) {
    try {
        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, useridx, username)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//가게 찜 취소
exports.editlikestore = async function (useridx, storeidx) {
    try {
        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const editlikestoreResult = await userDao.updateuserlikestore(connection, useridx,  storeidx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//유저 주소 삭제
exports.edituseraddress = async function (useridx,useraddress) {
    try {
        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const edituseraddressResult = await userDao.updateuseraddress(connection,useridx,useraddress)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//유저 기본주소 변경
exports.edituserbaseaddress = async function (useridx,useraddress) {
    try {

        const baseaddressRows = await userProvider.baseaddressCheck(useridx);
        if (baseaddressRows.length >0)
            return errResponse(baseResponse. BASEADDRESS_ONLY_ONE);

        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const edituserbaseaddressResult = await userDao.updateuserbaseaddress(connection,useridx,useraddress)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//유저 탈퇴
exports.edituserstatus = async function (useridx) {
    try {
        console.log(useridx)
        const connection = await pool.getConnection(async (conn) => conn);
        const edituserstatusResult = await userDao.updateuserstatus(connection,useridx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};