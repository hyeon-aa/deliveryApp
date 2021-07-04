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

//리뷰 보드 조회
exports.getreviewBoard = async function (req, res) {


    const storeidx = req.query.storeidx;
     // const page = req.query.page;
     // const size = req.query.size;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const reviewBoardByStoreidx = await storereviewProvider.retrievereviewBoard(storeidx);
    return res.send(response(baseResponse.REVIEWBOARD_SUCCESS,reviewBoardByStoreidx));
};

//리뷰 댓글 개수 조회
exports.getStorereviewcommentNum = async function (req, res) {


    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const StorereviewcommentNumByStoreidx = await storereviewProvider.retrieveStorereviewcommentNum(storeidx);
    return res.send(response(baseResponse.REVIEWCOMMENTNUM_SUCCESS,StorereviewcommentNumByStoreidx));
};

//리뷰 그래프 조회
exports.getreviewgraph = async function (req, res) {


    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const reviewgraphByStoreidx = await storereviewProvider.retrievereviewgraph(storeidx);
    return res.send(response(baseResponse.REVIEWGRAPH_SUCCESS,reviewgraphByStoreidx));
};
