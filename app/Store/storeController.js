const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const axios = require("axios");
const secret_config = require("../../../config/secret");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getStoreidx = async function (req, res) {


    const storeidx = req.params.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const storeByStoreidx = await storeProvider.retrieveStore(storeidx);
    return res.send(response(baseResponse.STOREINFO_SUCCESS, storeByStoreidx));
};

//음식점 카테고리 리스트 조회
exports.getstorecategoryList = async function (req, res) {

    const storecategoryList = await storeProvider.retrievestorecategoryList();
    return res.send(response(baseResponse.STORECATEGORYLIST_SUCCESS, storecategoryList));
};


//주소에 따른 카테고리별 음식점 조회
/*
exports.getcategoryStoreidx = async function (req, res) {

    const categoryidx = req.query.categoryidx;
    const useridx = req.verifiedToken.useridx ;


   if (!categoryidx) return res.send(errResponse(baseResponse. CATEGORY_CATEGORYIDX_EMPTY));
    if (!useridx) return res.send(errResponse(baseResponse. USER_USERIDX_EMPTY));

    const storeBycategoryidx = await storeProvider.retrieveStorecategory([categoryidx,useridx]);
    return res.send(response(baseResponse.STOREBYCATEGORY_SUCCESS, storeBycategoryidx));
};
*/

//주소에 따른 카테고리별 음식점 조회2(현재위치에따라서)
exports.getcategoryStoreidx = async function (req, res) {

  try {
      var {categoryidx, lat, long, sort,page,size} = req.query;
      const useridx = req.verifiedToken.useridx;

      const header = `KakaoAK ${secret_config.KAKAO_SECRET}`;
      const api_url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?input_coord=WGS84&output_coord=WGS84&y=${lat}&x=${long}`;

      axios({
          url: api_url,
          method: "get",
          headers: {
              Authorization: header,
          }
      })

          .then(function (response) {
              console.log(response.data.documents);
              console.log(response.data.documents[0].region_3depth_name);
          })

      if (!categoryidx) return res.send(errResponse(baseResponse.CATEGORY_CATEGORYIDX_EMPTY));
      if (!useridx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));

      const storeBycategoryidx = await storeProvider.retrieveStorecategory([categoryidx, useridx, lat, long, sort,page,size]);
      console.log('sort2', sort);
      return res.send(response(baseResponse.STOREBYCATEGORY_SUCCESS, storeBycategoryidx));
  }
  catch (err) {
        console.log(err);
    }

};

//음식점 메뉴 조회
exports.getmenuInfo = async function (req, res) {


    const storeidx = req.params.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const getmenuInfoByStoreidx = await storeProvider.retrievemenuInfo(storeidx);
    return res.send(response(baseResponse.STOREMENU_SUCCESS, getmenuInfoByStoreidx));
};


//가게 상세 정보
exports.getstoredetail = async function (req, res) {

    
    const storeidx = req.query.storeidx;

    if (!storeidx) return res.send(errResponse(baseResponse. STORE_STOREIDX_EMPTY));

    const storedetailByStoreidx = await storeProvider.retrievestoredetail(storeidx);
    return res.send(response(baseResponse.STOREDETAIL_SUCCESS,storedetailByStoreidx));
};




