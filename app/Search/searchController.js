const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("../../app/Search/searchProvider");
const searchService = require("../../app/Search/searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getsearchrank = async function (req, res) {

    /**
     * Path Variable: userId
     */

    const searchrank = await searchProvider.retrievesearchrank();
    return res.send(response(baseResponse.RANK_SUCCESS, searchrank));
};