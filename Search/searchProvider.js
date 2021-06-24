const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");


//검색순위 조회
exports.retrievesearchrank= async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchrankResult = await searchDao.selectsearchrank(connection);

    connection.release();

    return searchrankResult;
};