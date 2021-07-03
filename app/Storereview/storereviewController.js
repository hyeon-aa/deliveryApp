const jwtMiddleware = require("../../../config/jwtMiddleware");
const storereviewProvider = require("../../app/Storereview/storereviewProvider");
const storereviewService = require("../../app/Storereview/storereviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

//리뷰등록
exports.poststorereview = async function (req, res) {

    const useridx = req.verifiedToken.useridx ;
    const {storeidx,orderidx,userstarRating,usercomment,reviewImgPath} = req.body;


    // 빈 값 체크
    if (!storeidx)
        return res.send(response(baseResponse.STORE_STOREIDX_EMPTY));

    if (!userstarRating) return res.send(errResponse(baseResponse.STARRATING_EMPTY));

    if (!usercomment)
        return res.send(response(baseResponse.REVIEWCOMMENT_EMPTY ));

    // 리뷰 길이 체크
    if (usercomment.length <5)
        return res.send(response(baseResponse.REVIEWCOMMENT_LENGTH));

    // 별점 체크
    if (userstarRating<1 || userstarRating >5)
        return res.send(response(baseResponse.STARRATING_LENGTH ));

    const postreviewResponse = await storereviewService.createstorereview(
        useridx,storeidx,orderidx,userstarRating,usercomment,reviewImgPath
    );

    return res.send(postreviewResponse);
};

//리뷰 삭제
exports.patchstorereview = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.useridx

    const useridx = req.params.useridx;
    const reviewidx = req.body.reviewidx;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!reviewidx) return res.send(errResponse(baseResponse.REVIEW_REVIEWIDX_EMPTY ));

        const editreview = await storereviewService.editreview(useridx,reviewidx)
        return res.send(editreview);
    }
};

//리뷰 수정
exports.patchstorereviewcontent = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.useridx

    const useridx = req.params.useridx;
    const reviewidx = req.body.reviewidx;
    const userstarRating = req.body.userstarRating;
    const usercomment = req.body.usercomment;

    if (userIdFromJWT != useridx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!usercomment) return res.send(errResponse(baseResponse.REVIEWCOMMENT_EMPTY));
        if (!userstarRating) return res.send(errResponse(baseResponse.STARRATING_EMPTY));
        if (usercomment.length <5)
            return res.send(response(baseResponse.REVIEWCOMMENT_LENGTH));
        if (userstarRating<1 || userstarRating >5)
            return res.send(response(baseResponse.STARRATING_LENGTH ));

        const editreviewcontent = await storereviewService.editreviewcontent(userstarRating,usercomment,useridx,reviewidx)
        return res.send(editreviewcontent);
    }
};


//리뷰 리스트 조회
exports.getStorereviewList = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const StorereiviewListByStoreidx = await storereviewProvider.retrieveStorereviewList(storeidx);
    return res.send(response(baseResponse.SUCCESS, StorereiviewListByStoreidx));
};

//리뷰 메뉴 추천여부 조회
exports.getreviewmenurecommend = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const reviewmenurecommendByStoreidx = await storereviewProvider.retrievereviewmenurecommend(storeidx);
    return res.send(response(baseResponse.SUCCESS,reviewmenurecommendByStoreidx));
};

//리뷰 사진 조회
exports.getStorereviewimg = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const reviewimgByStoreidx = await storereviewProvider.retrievereviewimg(storeidx);
    return res.send(response(baseResponse.SUCCESS,reviewimgByStoreidx));
};

//리뷰 보드 조회
exports.getreviewBoard = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const reviewBoardByStoreidx = await storereviewProvider.retrievereviewBoard(storeidx);
    return res.send(response(baseResponse.REVIEWBOARD_SUCCESS,reviewBoardByStoreidx));
};

//리뷰 댓글 개수 조회
exports.getStorereviewcommentNum = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const StorereviewcommentNumByStoreidx = await storereviewProvider.retrieveStorereviewcommentNum(storeidx);
    return res.send(response(baseResponse.REVIEWCOMMENTNUM_SUCCESS,StorereviewcommentNumByStoreidx));
};

//별점별 사용자 수 조회
exports.getreviewpeople = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const StorereviewpeopleByStoreidx = await storereviewProvider.retrievereviewpeople(storeidx);
    return res.send(response(baseResponse.SUCCESS,StorereviewpeopleByStoreidx));
};

//월별 리뷰 조회
exports.getmonthreview = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const monthreviewByStoreidx = await storereviewProvider.retrievemonthreview(storeidx);
    return res.send(response(baseResponse.SUCCESS,monthreviewByStoreidx));
};

//총 평점 조회
exports.gettotalstar = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const totalstarByStoreidx = await storereviewProvider.retrievetotalstar(storeidx);
    return res.send(response(baseResponse.SUCCESS,totalstarByStoreidx));
};


//리뷰 그래프 조회
exports.getreviewgraph = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const reviewgraphByStoreidx = await storereviewProvider.retrievereviewgraph(storeidx);
    return res.send(response(baseResponse.REVIEWGRAPH_SUCCESS,reviewgraphByStoreidx));
};
