// userId 회원 주문 조회
async function selectUserID(connection, useridx) {
    const selectUserIDQuery = `
        SELECT useridx,orderidx
        FROM OrderInfo
        WHERE useridx = ?;
    `;
    const [userRow] = await connection.query(selectUserIDQuery, useridx);
    return userRow;
}

// userId 회원 주문 조회
async function selectOrderID(connection, orderidx) {
    const selectOrderIDQuery = `
        SELECT useridx,orderidx
        FROM OrderInfo
        WHERE orderidx = ?;
    `;
    const [orderRow] = await connection.query(selectOrderIDQuery, orderidx);
    return orderRow;
}

// 유저 주문번호 조회
async function selectuserorderID(connection, useridx) {
    const selectuserorderidxQuery = `
        SELECT orderidx
        FROM OrderInfo
        WHERE useridx = ?;
    `;
    const [userorderRow] = await connection.query(selectuserorderidxQuery,useridx);
    return userorderRow;
}

// 가게 리뷰 등록
async function insertstorereview(connection, [useridx,storeidx,orderidx,userstarRating,usercomment,reviewImgPath]) {
    try {
        const insertstorereviewQuery = `
            INSERT INTO Review(useridx, storeidx, orderidx, userstarRating, usercomment)
            VALUES (?, ?, ?, ?, ?);
        `;
        const insertReviewImgQuery = `INSERT INTO ReviewMenuImage(reviewidx, reviewImgPath)
                                      VALUES (?, ?);`;
        const lastInsertIdQuery = `select LAST_INSERT_ID() insertidx;`;

        await connection.beginTransaction();
        const insertstorereviewRow = await connection.query(
            insertstorereviewQuery,
            [useridx, storeidx, orderidx, userstarRating, usercomment]
        );
        const reviewidx = await connection.query(lastInsertIdQuery);
        console.log(reviewidx);
        const insertstorereviewImgRow = await connection.query(
            insertReviewImgQuery,
            [reviewidx[0][0].insertidx, reviewImgPath]
        );
        await connection.commit();
        return insertstorereviewRow;
    } catch (err) {
        console.error(err);
        await connection.rollback();
    }
}

//리뷰 리스트 조회
async function selectStorereviewList(connection, storeidx) {
    const selectStorereviewListQuery = `
        select distinct(Review.reviewidx),
                       User.username,
                       Menu.storeidx,
                       Review.usercomment,
                       Review.userstarRating , Boss.bosscomment , case
                    when timestampdiff(day,Review.updatedAt, current_timestamp()) < 1
                        then '오늘'
                    when timestampdiff(day,Review.updatedAt, current_timestamp()) < 2
                        then '어제'
                    when timestampdiff(day,Review.updatedAt, current_timestamp()) < 3
                            then '그저께'
                    when timestampdiff(day,Review.updatedAt, current_timestamp()) < 7
                        then '지난주'
                    when timestampdiff(day,Review.updatedAt, current_timestamp()) < 30
                         then '지난달'
                    else
                        date_format(Review.updatedAt,'%Y.%m.%d')end as updatedAt
        from OrderItem
                 left join Menu on Menu.menuidx = OrderItem.menuidx
                 left join OrderInfo on OrderItem.orderidx = OrderInfo.orderidx
                 left join Review on Menu.storeidx = Review.storeidx
                 left join Store on Store.storeidx = Review.storeidx
                 left outer join Boss on Boss.reviewidx = Review.reviewidx
                 left outer join User on User.useridx = Review.useridx
        where OrderInfo.storeidx = ?
          and Review.orderidx = OrderItem.orderidx
        order by reviewidx;
    `;
    const [StorereviewListRow] = await connection.query(selectStorereviewListQuery, storeidx);
    console.log(storeidx);
    return StorereviewListRow;
}

//리뷰 메뉴 추천여부 조회
async function selectreviewmenurecommend(connection, storeidx) {
    const selectreviewmenurecommendQuery = `
    select User.username,Review.reviewidx,Menu.menuname,Menu.storeidx,Reviewmenurecommend.status AS 'recommend'
    from OrderItem left join Menu on Menu.menuidx=OrderItem.menuidx
    left join OrderInfo on OrderItem.orderidx=OrderInfo.orderidx
    left join Review on Menu.storeidx=Review.storeidx
    left join Store on Store.storeidx=Review.storeidx
    left outer join Reviewmenurecommend on Review.reviewidx=Reviewmenurecommend.reviewidx
    and Reviewmenurecommend.menuidx=Menu.menuidx
    left outer join User on User.useridx=Review.useridx
    where OrderInfo.storeidx=? and Review.orderidx=OrderItem.orderidx
    order by reviewidx;
    `;
    const [reviewmenurecommendRow] = await connection.query(selectreviewmenurecommendQuery, storeidx);
    console.log(storeidx);
    return reviewmenurecommendRow;
}

//리뷰 사진 조회
async function selectreviewimg(connection, storeidx) {
    const selectreviewimgQuery = `
        select ReviewMenuImage.reviewImgpath,Review.reviewidx,User.username
        from ReviewMenuImage inner join Review on ReviewMenuImage.reviewidx=Review.reviewidx
                             inner join User on User.useridx=Review.useridx
        where storeidx=?;
    `;
    const [reviewimgRow] = await connection.query(selectreviewimgQuery, storeidx);
    console.log(storeidx);
    return reviewimgRow;
}

//리뷰 댓글 수 조회
async function selectreviewcommentNum(connection, storeidx) {
    const selectreviewcommentNumQuery = `
    select S.storename,Review.storeidx,count(Review.reviewidx) AS 'reviewnum',count(Boss.bosscommentidx) AS 'bosscommentnum'
    from (select storename,storeidx from Store) S left join Review
    left join Boss on Review.reviewidx=Boss.reviewidx
    on S.storeidx=Review.storeidx
    where S.storeidx=?
    group by S.storeidx;
    `;
    const [reviewcommentNumRow] = await connection.query(selectreviewcommentNumQuery, storeidx);
    console.log(storeidx);
    return reviewcommentNumRow;
}

//리뷰 별점별 사람수
async function selectreviewpeople(connection, storeidx) {
    const selectreviewpeopleQuery = `
        select * from(
                         select star as 'userstarRating', count(R.useridx) AS 'num by star'
                         from Starrate
                                  left join Review R on Starrate.star=R.userstarRating and storeidx=?
                         group by star)a;
    `;
    const [reviewpeopleRow] = await connection.query(selectreviewpeopleQuery, storeidx);
    console.log(storeidx);
    return reviewpeopleRow;
}

//월별 리뷰
async function selectmonthreview(connection, storeidx) {
    const selectmonthreviewQuery = `
        select *
        from(
                select date_format(td.d, '%Y-%m') date,count(R.reviewidx) as'reviewnum',ifnull(round(avg(R.userstarRating),1),0) as'starrate by month'
                from date_t td
                    left join Review R on (date_format(R.updatedAt,'%Y-%m-%d')=td.d) and storeidx=?
                group by date
            )a
        where date between date_format(date_add(now(),interval -6 month),'%Y-%m') and date_format(now(),'%Y-%m');
    `;
    const [monthreviewRow] = await connection.query(selectmonthreviewQuery, storeidx);
    console.log(storeidx);
    return monthreviewRow;
}

//총 평점
async function selecttotalstar(connection, storeidx) {
    const selecttotalstarQuery = `
        select S.storename,round(avg(Review.userstarRating),1) AS "totalstarrate"
        from (select storename,storeidx from Store) S left join Review
              on S.storeidx=Review.storeidx
        where S.storeidx=?
        group by S.storeidx;
    `;
    const [totalstarRow] = await connection.query(selecttotalstarQuery, storeidx);
    console.log(storeidx);
    return totalstarRow;
}

//리뷰 수정
async function updateReviewcontent(connection,userstarRating,usercomment,useridx,reviewidx) {
    const updateReviewcontentQuery = `
        UPDATE Review
        SET userstarRating=? ,usercomment=?
        WHERE useridx=? and reviewidx = ?;`;
    const updateReviewcontentRow = await connection.query(updateReviewcontentQuery, [userstarRating,usercomment,useridx,reviewidx]);
    return updateReviewcontentRow[0];
}

//리뷰 삭제
async function updateReview(connection, useridx,reviewidx,status) {
    const updateReviewQuery = `
        UPDATE Review
        SET status = 1
        WHERE useridx=? and reviewidx = ? ;`;
    const updateReviewRow = await connection.query(updateReviewQuery, [useridx,reviewidx,status]);
    return updateReviewRow[0];
}



module.exports ={
    insertstorereview,
    selectStorereviewList,
    selectreviewmenurecommend,
    selectreviewcommentNum,
    selectmonthreview,
    selectreviewpeople,
    selectmonthreview,
    selecttotalstar,
    selectUserID,
    selectOrderID,
    selectreviewimg,
    updateReview,
    updateReviewcontent,
    selectuserorderID
};