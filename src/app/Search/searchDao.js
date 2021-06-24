// 검색순위 조회
async function selectsearchrank(connection) {
    const selectsearchrankQuery = `
        select Search.searchcontent,count(searchcontent),
               date_format(now(),'%m.%d %h:00')
        from Search
        where createdAt < date_format(now(),'%Y.%m.%c %h:00:00')
        group by searchcontent
        order by count(searchcontent) desc;
    `;
    const [searchrankRow] = await connection.query(selectsearchrankQuery);

    return searchrankRow;
}

module.exports ={
    selectsearchrank
};