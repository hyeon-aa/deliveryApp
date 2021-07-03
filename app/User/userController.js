const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;
const secret_config = require("../../../config//secret");

const axios = require("axios");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const crypto = require("crypto");

//회원가입
exports.postUsers = async function (req, res) {


    const {useremail ,username,userphoneNum,birthday,userpassword} = req.body;

    // 빈 값 체크
    if (!useremail)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    if (!userpassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    if (userpassword.length<5 || userpassword.length>17)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    var regPhone = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(userphoneNum))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));

    if (!userphoneNum)
        return res.send(response(baseResponse.SIGNUP_PHONENUM_EMPTY ));

    // 길이 체크
    if (useremail.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(useremail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    const hashedPassword = await crypto
        .createHash("sha512")
        .update(userpassword)
        .digest("hex");

    const signUpResponse = await userService.createUser(
        useremail ,username,userphoneNum,birthday,hashedPassword
    );

    return res.send(signUpResponse);
};

//가게 찜 등록
exports.postlikestores = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const {storeidx} = req.body;

    // 가게번호 체크
    if (!storeidx)
        return res.send(response(baseResponse. STORE_STOREIDX_EMPTY));

    const likestoreResponse = await userService.createlikestore(
      useridx,storeidx
    );

    return res.send(likestoreResponse);
};

//유저 포인트 적립
exports.postpointsave = async function (req, res) {

    const  useridx= req.verifiedToken.useridx;
    const orderidx = req.query.orderidx;

      if (!orderidx)
        return res.send(response(baseResponse. ORDER_ORDERIDX_EMPTY));

    const pointsaveResponse = await userService.createpointsave(
        useridx,orderidx
    );

    return res.send(pointsaveResponse);
};

//유저 포인트 사용
exports.postpointuse = async function (req, res) {

    const  useridx= req.verifiedToken.useridx;
    const {orderidx,pointuse} = req.body;

    if (!pointuse)
        return res.send(response(baseResponse. POINT_POINTUSE_EMPTY ));

    if (!orderidx)
        return res.send(response(baseResponse. ORDER_ORDERIDX_EMPTY));

    const pointuseResponse = await userService.createpointuse(
        useridx,orderidx,pointuse
    );

    return res.send(pointuseResponse);
};

//유저 주소 등록
/*
exports.postaddress = async function (req, res) {

    const useridx = req.verifiedToken.useridx ;
    const {useraddress,dongname,latitude,longitude,base} = req.body;

    // 주소 체크
    if (!useraddress)
        return res.send(response(baseResponse.USER_ADDRESS_EMPTY));

    // 동이름 체크
    if (!dongname)
        return res.send(response(baseResponse.USER_DONGNAME_EMPTY));

    // 위도 체크
    if (!latitude)
        return res.send(response(baseResponse.USER_LATITUDE_EMPTY));

    // 위도 길이 체크
    if (latitude>43 || latitude<33)
        return res.send(response(baseResponse.LATITUDE_LENGTH));

    // 경도 체크
    if (!longitude)
        return res.send(response(baseResponse. USER_LONGITUDE_EMPTY));

    // 경도 길이 체크
    if (longitude>132 || longitude<124)
        return res.send(response(baseResponse.LONGITUDE_LENGTH));

    // 기본배송지여부 체크
    if (!base)
        return res.send(response(baseResponse.USER_BASE_EMPTY));

    const addressResponse = await userService.createaddress(
        useridx,useraddress,dongname,latitude,longitude,base
    );


    return res.send(addressResponse);
};
*/

//유저 주소 등록2
exports.postaddress = async function (req, res) {

    const useridx = req.verifiedToken.useridx;
    const {latitude, longitude, base} = req.body;

    const header = `KakaoAK ${secret_config.KAKAO_SECRET}`;
    const api_url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?input_coord=WGS84&output_coord=WGS84&y=${latitude}&x=${longitude}`;


    const result = await axios({
        url: api_url,
        method: "get",
        headers: {
            Authorization: header,
        }
    })

        .then(function (response) {
            //console.log(response.data.documents);
            const dongname = response.data.documents[0].region_3depth_name;
            const useraddress = response.data.documents[0].address_name;
            // console.log(response.data.documents[0].region_3depth_name);
            let myadd=[];
            myadd.push(dongname);
            myadd.push(useraddress);
            console.log(myadd);
            return myadd;
        })
        .catch((err) => {
            console.log(err);
        });

    console.log('결과',result);
    const dongname=result[0];
    console.log('동이름',dongname);
    const useraddress=result[1];

            // 위도 체크
            if (!latitude)
                return res.send(response(baseResponse.USER_LATITUDE_EMPTY));

            // 위도 길이 체크
            if (latitude > 43 || latitude < 33)
                return res.send(response(baseResponse.LATITUDE_LENGTH));

            // 경도 체크
            if (!longitude)
                return res.send(response(baseResponse.USER_LONGITUDE_EMPTY));

            // 경도 길이 체크
            if (longitude > 132 || longitude < 124)
                return res.send(response(baseResponse.LONGITUDE_LENGTH));

            // 기본배송지여부 체크
            if (!base)
                return res.send(response(baseResponse.USER_BASE_EMPTY));

    var addressResponse = await userService.createaddress(
        useridx, useraddress, dongname, latitude, longitude, base
    );

    return res.send(addressResponse);
};


//유저 검색내용 등록
exports.postsearchcontent = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const {searchcontent} = req.body;


    // 검색내용 체크
    if (!searchcontent)
        return res.send(response(baseResponse.SEARCH_SEARCHCONTENT_EMPTY));

    // 검색내용 길이 체크
    if (searchcontent.length<2)
        return res.send(response(baseResponse.SEARCHCONTENT_LENGTH));


    const searchcontentResponse = await userService.createsearchcontent(
       useridx,searchcontent
    );


    return res.send(searchcontentResponse);
};

//유저 쿠폰 등록
exports.postnewcoupon = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;
    const {couponidx} = req.body;

    // 쿠폰번호 체크
    if (!couponidx)
        return res.send(response(baseResponse.COUPON_COUPONIDX_EMPTY));


    const newcouponResponse = await userService.createnewcoupon(
     useridx,couponidx
    );


    return res.send(newcouponResponse);
};



//유저 조회(이메일)
exports.getUsers = async function (req, res) {
    
    const useremail = req.query.useremail;

    if (!useremail) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.USER_SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(useremail);
        return res.send(response(baseResponse.USER_SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
   // const useridx = req.params.useridx;
    const useridx = req.verifiedToken.useridx ;

    const userByUserId = await userProvider.retrieveUser(useridx);
    return res.send(response(baseResponse.USER_SUCCESS, userByUserId));
};

//찜한 가게 조회
exports.getlikestoreById = async function (req, res) {

    /**
     * Path Variable: userId
     */

    const useridx = req.verifiedToken.useridx ;



    const likestoreByUserId = await userProvider.retrieveUserlikestore(useridx);
    return res.send(response(baseResponse.LIKESTORE_SUCCESS, likestoreByUserId));
};

//주문내역 조회
exports.getorderlistById = async function (req, res) {

     const useridx = req.verifiedToken.useridx ;

    const orderlistByUserId = await userProvider.retrieveorderlist(useridx);
    return res.send(response(baseResponse.ORDERLIST_SUCCESS, orderlistByUserId));
};

//유저쿠폰 조회
exports.getusercoupon = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;

    const usercouponByUserId = await userProvider.retrieveusercoupon(useridx);
    return res.send(response(baseResponse.COUPON_SUCCESS,usercouponByUserId));
};

//유저포인트 조회
exports.getuserpoint= async function (req, res) {

    //const useridx = req.query.useridx ;
    const useridx = req.verifiedToken.useridx ;

    const userpointByUserId = await userProvider.retrieveuserpoint(useridx);
    return res.send(response(baseResponse.POINT_SUCCESS,userpointByUserId));
};

//유저포인트 내역 조회
exports.getuserpointinfo= async function (req, res) {

    const useridx = req.verifiedToken.useridx ;

    const userpointinfoByUserId = await userProvider.retrieveuserpointinfo(useridx);
    return res.send(response(baseResponse.POINT_SUCCESS,userpointinfoByUserId));
};

//유저포인트 전체 조회
exports.getuserpointdetail= async function (req, res) {

    const useridx = req.verifiedToken.useridx ;

    const userpointdetailByUserId = await userProvider.retrieveuserpointdetail(useridx);
    return res.send(response(baseResponse.POINT_SUCCESS,userpointdetailByUserId));
};


//유저주소 조회
exports.getuseraddress= async function (req, res) {

    const useridx = req.verifiedToken.useridx ;

    const useraddressByUserId = await userProvider.retrieveuseraddress(useridx);
    console.log('1',useraddressByUserId);
    console.log('2',useraddressByUserId[0]);
    console.log('3',useraddressByUserId[0].useraddress);
    console.log('4',Object.values(useraddressByUserId));
    return res.send(response(baseResponse.ADDRESS_SUCCESS,useraddressByUserId));
};

//검색내역 조회
exports.getusersearch = async function (req, res) {

    const useridx = req.verifiedToken.useridx ;

    const usersearchByUserId = await userProvider.retrieveusersearch(useridx);
    return res.send(response(baseResponse.SEARCHINFO_SUCCESS,usersearchByUserId));
};

//내가 쓴 리뷰 조회
exports.getmyreview = async function (req, res) {

    const useridx = req.verifiedToken.useridx ;

    const myreviewByUserId = await userProvider.retrievemyreview(useridx);
    return res.send(response(baseResponse.MYREVIEW_SUCCESS,myreviewByUserId));
};

//내가 쓴 리뷰 이미지  조회
exports.getmyreviewimg = async function (req, res) {
    
    const useridx = req.verifiedToken.useridx ;

    const myreviewimgByUserId = await userProvider.retrievemyreviewimg(useridx);
    return res.send(response(baseResponse.MYREVIEW_SUCCESS,myreviewimgByUserId));
};

//내가 쓴 리뷰 정보  조회
exports.getmyreviewInfo = async function (req, res) {


    const useridx = req.verifiedToken.useridx ;

    const myreviewInfoByUserId = await userProvider.retrievemyreviewInfo(useridx);
    return res.send(response(baseResponse.MYREVIEW_SUCCESS,myreviewInfoByUserId));
};

// 로그인
exports.login = async function (req, res) {

    const {useremail, userpassword} = req.body;

    // 빈 값 체크
    if (!useremail)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));

    if (!userpassword)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    if (!regexEmail.test(useremail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));


    const signInResponse = await userService.postSignIn(useremail, userpassword );

    return res.send(signInResponse);
};


//회원정보 수정
exports.patchUsers = async function (req, res) {


    const userIdFromJWT = req.verifiedToken.useridx

    const  useridx= req.params.useridx;
    const username = req.body.username;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!username) return res.send(errResponse(baseResponse.USER_NAME_EMPTY));

        const editUserInfo = await userService.editUser(useridx, username)
        return res.send(editUserInfo);
    }
};

//찜한 가게 삭제
exports.patchlikestores = async function (req, res) {
    

    const userIdFromJWT = req.verifiedToken.useridx

    const  useridx= req.params.useridx;
    const storeidx = req.body.storeidx;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!storeidx) return res.send(errResponse(baseResponse.STORE_STOREIDX_EMPTY));

        const editlikestore = await userService.editlikestore(useridx, storeidx)
        return res.send(editlikestore);
    }
};

//유저 주소 삭제
exports.patchuseraddress = async function (req, res) {
    

    const userIdFromJWT = req.verifiedToken.useridx

    const  useridx= req.params.useridx;
    const useraddress = req.body.useraddress;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!useraddress) return res.send(errResponse(baseResponse.USER_ADDRESS_EMPTY));

        const edituseraddress = await userService.edituseraddress(useridx, useraddress)
        return res.send(edituseraddress);
    }
};

//카카오로그인
passport.use('kakao-login', new KakaoStrategy({
        clientID: '${secret_config.KAKAO_SECRET}',
        callbackURL: 'http://localhost:3000/auth/kakao1/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(refreshToken);
}));







/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
