// 모든 유저 조회
async function selectUser(connection) {
    const selectUserListQuery = `
                SELECT useremail, username ,usergrade
                FROM User;
                `;
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, useremail) {
    const selectUserEmailQuery = `
                SELECT useremail, username,usergrade,useridx
                FROM User 
                WHERE useremail = ?;
                `;
    const [emailRows] = await connection.query(selectUserEmailQuery, useremail);
    return emailRows;
}

// userId 회원 조회
async function selectUserID(connection, useridx) {
    const selectUserIDQuery = `
        SELECT  useremail, username,usergrade,userphoneNum,userimage
        FROM User
        WHERE useridx = ?;
    `;
    const [userRow] = await connection.query(selectUserIDQuery, useridx);
    return userRow;
}

// storeidx 음식점 조회
async function selectstoreID(connection, storeidx) {
    const selectstoreIDQuery = `
        SELECT storeidx,storename
        FROM Store
        WHERE storeidx = ?;
    `;
    const [storeRow] = await connection.query(selectstoreIDQuery,storeidx);
    return storeRow;
}

// 쿠폰번호 조회
async function selectcouponidx(connection, couponidx) {
    const selectcouponidxQuery = `
        SELECT couponidx,couponcode
        FROM Coupon
        WHERE couponidx = ?;
    `;
    const [couponRow] = await connection.query(selectcouponidxQuery,couponidx);
    return couponRow;
}

// 주문번호 조회
async function selectorderID(connection, orderidx) {
    const selectorderidxQuery = `
        SELECT orderidx
        FROM OrderInfo
        WHERE orderidx = ?;
    `;
    const [orderRow] = await connection.query(selectorderidxQuery,orderidx);
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

// 유저 기본배송지  조회
async function selectbaseaddress(connection, useridx) {
    const selectbaseaddressQuery = `
        SELECT useridx,useraddress
        FROM Useraddress
        WHERE useridx = ? and base=0;
    `;
    const [baseaddressRow] = await connection.query(selectbaseaddressQuery,useridx);
    return baseaddressRow;
}

// 유저 주소 조회
async function selectuseraddress(connection, useridx) {
    const selectuseraddressQuery = `
        select Useraddress.useraddress
        from Useraddress
        where useridx=?;
    `;
    const [useraddressRow] = await connection.query(selectuseraddressQuery, useridx);
    return useraddressRow;
}

//찜한 가게 조회
async function selectlikestore(connection, useridx) {
    const selectlikestoreQuery = `
        select Store.storename,Store.deliverytip,Store.deliveryexpectTime,Store.orderamountmin,Store.takeout,orderc,
               Store.storeimage,round(avg(Review.userstarRating),1) as'totalstarrate'
        from (select Store.storename,Store.storeidx,
                     case when count(OrderInfo.useridx)=1 then 1
                          when count(OrderInfo.useridx)=2 then 2
                          when count(OrderInfo.useridx)=3 then 3
                          when 20<=count(OrderInfo.useridx)<50 then concat(cast(20 as char(15)),'+')
                          when 50<=count(OrderInfo.useridx)<100 then concat(cast(50 as char(15)),'+')
                          else concat(cast(100 as char(15)),'+')
                         end as orderc
              from OrderInfo right join Store on Store.storeidx=OrderInfo.storeidx group by OrderInfo.storeidx) OI
                 right join Review on Review.storeidx=OI.storeidx
                 right join Store on Store.storeidx=Review.storeidx
                 right join Userlikestore on Userlikestore.storeidx=Store.storeidx
        where Userlikestore.useridx=1 and Userlikestore.status=0
        group by Userlikestore.storeidx

    `;
    const [userlikestoreRow] = await connection.query(selectlikestoreQuery, useridx);
    return userlikestoreRow;
}

//주문내역조회
async function selectorderlist(connection, useridx) {
    const selectorderlistQuery = `
        select storename,deliverystatus,(A.totalamount-ifnull(coupon,0)-ifnull(pointuse,0))as 'paymentamount',orderdate,orderidx,ordermenu,
               storeimage from(
                                  select  Store.storename
                                       ,(sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity)+(Delivery.deliveryaddtip+Store.deliverytip)) AS "totalamount"
                                       ,(OrderInfo.updatedAt)AS "orderdate",OrderInfo.orderidx,ordermenu,
                                      Store.storeimage,OrderInfo.useridx,OrderInfo.storeidx,deliverystatus,pointuse
                                  from (select OrderItem.orderidx,
                                               case when count(OrderItem.menuidx)=1 then Menu.menuname
                                                    else concat(Menu.menuname ,' 외 ', cast(count(OrderItem.menuidx)-1 AS char(15))) end as ordermenu
                                        from OrderItem, Menu where Menu.menuidx=OrderItem.menuidx group by OrderItem.orderidx) OI
                                           inner join OrderInfo on OrderInfo.orderidx=OI.orderidx
                                           inner join Store on Store.storeidx=OrderInfo.storeidx
                                           inner join Delivery on Store.storeidx=Delivery.storeidx and OrderInfo.storeidx=Delivery.storeidx
                                           inner join Useraddress  on Useraddress.dongname=Delivery.dongname and Useraddress.useridx=OrderInfo.useridx and Useraddress.base=0
                                           inner join Menu on Menu.storeidx=Delivery.storeidx
                                           inner join ShoppingBasket on Menu.menuidx=ShoppingBasket.menuidx
                                           join Menudetail on ShoppingBasket.menudetailidx=Menudetail.menudetailidx and OrderInfo.basketidx=ShoppingBasket.basketidx  and ShoppingBasket.status='Y'
                                           left join PointUse on OrderInfo.orderidx= PointUse.orderidx
                                  where OrderInfo.useridx=?
                                  group by ShoppingBasket.basketidx)as A
                                  left join (
            select OrderInfo.useridx,OrderInfo.storeidx,ifnull(Coupon.coupondiscount,0) as 'coupon'
            from Coupon right join OrderInfo on OrderInfo.storeidx=Coupon.storeidx
                        right join Havecoupon on Havecoupon.useridx=OrderInfo.useridx
                and Coupon.couponidx=Havecoupon.couponidx and validity>current_timestamp()) as B
                                            on A.useridx=B.useridx and A.storeidx=B.storeidx;

    `;
    const [orderlistRow] = await connection.query(selectorderlistQuery, useridx);
    return orderlistRow;
}



//유저 쿠폰 조회
async function selectusercoupon(connection, useridx) {
    const selectusercouponQuery = `
        select Store.storename,Store.orderamountmin,Coupon.couponidx,Coupon.coupondiscount,Coupon.validity
             ,Store.takeout
        from Coupon inner join Havecoupon on Coupon.couponidx=Havecoupon.couponidx
                    join Store on Store.storeidx=Coupon.storeidx
        where useridx=? and validity>current_timestamp()
    `;
    const [usercouponRow] = await connection.query(selectusercouponQuery, useridx);
    return usercouponRow;
}


//유저 포인트 조회
async function selectuserpoint(connection, useridx) {
    const selectuserpointQuery = `
        select sum(-PointUse.pointuse+PointUse.pointsave) as 'mypoint'
        from PointUse
        where PointUse.useridx=?
        group by PointUse.useridx;
        `;
    const selectuserpointinfoQuery = `
        select pointuse,pointsave
        from PointUse
        where PointUse.useridx=?;
        `;
    const [userpointinfoRow] = await connection.query(selectuserpointinfoQuery, useridx);
    const [userpointRow] = await connection.query(selectuserpointQuery, useridx);
    pointarray=[];
    pointarray.push(userpointRow);
    pointarray.push(userpointinfoRow);
    return pointarray;
}

//사용자 검색내역조회
async function selectsearchlist(connection, useridx) {
    const selectsearchlistQuery = `
        select searchcontent
        from Search where useridx=?
                      and timestampdiff(day,createdAt,current_timestamp())<14;
    `;
    const [searchlistRow] = await connection.query(selectsearchlistQuery, useridx);
    return searchlistRow;
}

//내가 쓴 리뷰 조회
async function selectmyreview(connection, useridx) {
    const selectmyreviewQuery = `
        select distinct(Review.reviewidx),
                       User.username,
                       Menu.storeidx,
                       Review.usercomment,
                       Review.userstarRating , case
                    when timestampdiff(day,Review.updatedAt, current_timestamp()) < 1
                                then '오늘'
                           when timestampdiff(day,Review.updatedAt, current_timestamp()) < 2
                                 then '어제'
                     when timestampdiff(day,Review.updatedAt, current_timestamp()) < 3
                      then '그저께'
                      when timestampdiff(day,Review.updatedAt, current_timestamp()) < 7
                            then '한달전'
                   else
          date_format(Review.updatedAt,'%Y.%m.%d')end as updatedAt
        from OrderItem
                 inner join Menu on Menu.menuidx = OrderItem.menuidx
                 inner join OrderInfo on OrderItem.orderidx = OrderInfo.orderidx
                 inner join Review on Menu.storeidx = Review.storeidx and Review.status=0
                 inner join Store on Store.storeidx = Review.storeidx
                 inner join User on User.useridx = Review.useridx
        where User.useridx=?
          and Review.orderidx = OrderItem.orderidx
        order by reviewidx
    `;
    const selectmyreviewimgQuery = `
        select ReviewMenuImage.reviewImgpath,Review.reviewidx,User.username
        from ReviewMenuImage inner join Review on ReviewMenuImage.reviewidx=Review.reviewidx and Review.status=0
                             inner join User on User.useridx=Review.useridx
        where User.useridx=?;
    `;
    const [myreviewimgRow] = await connection.query(selectmyreviewimgQuery, useridx);
    const [myreviewRow] = await connection.query(selectmyreviewQuery, useridx);
    myreviewarray=[];
    myreviewarray.push(myreviewRow);
    myreviewarray.push(myreviewimgRow);
    return myreviewarray;
}



// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
        INSERT INTO User(useremail ,username,userphoneNum,birthday,userpassword)
        VALUES (?, ?, ?,?,?);
    `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );

    return insertUserInfoRow;
}

// 가게 찜 등록
async function insertlikestore(connection, insertlikestoreParams) {
    const insertlikestoreQuery = `
        INSERT INTO Userlikestore(useridx,storeidx)
        VALUES (?,?)
    `;
    const insertlikestoreRow = await connection.query(
        insertlikestoreQuery,
        insertlikestoreParams
    );

    return insertlikestoreRow;
}

//유저 찜 등록,취소
async function updateuserlikestore(connection,status,useridx,storeidx) {
    const updateuserlikestoreQuery = `
  UPDATE Userlikestore
  SET status = ?
  WHERE useridx = ? and storeidx =? `;
    const updateuserlikestoreRow = await connection.query(updateuserlikestoreQuery, [status,useridx,storeidx]);
    return updateuserlikestoreRow[0];
}

//유저 찜한가게 상태 조회
async function selectuserlikestorestatus(connection, useridx,storeidx) {
    const selectuserlikestorestatusQuery = `
 select useridx,storeidx,status
 from Userlikestore
     where useridx=? and storeidx=?
     `;
    const selectuserlikestorestatusRow = await connection.query(selectuserlikestorestatusQuery, [useridx,storeidx]);
    return selectuserlikestorestatusRow[0];
}

// 유저 포인트 사용
async function insertpointuse(connection, insertpointuseParams) {
    const insertpointuseQuery = `
        INSERT INTO PointUse(useridx,orderidx,pointuse)
        VALUES (?,?,?)
    `;
    const insertpointuseRow = await connection.query(
        insertpointuseQuery,
        insertpointuseParams
    );

    return insertpointuseRow;
}

// 유저 포인트 적립
async function insertpointsave(connection, insertpointsaveParams) {
    const insertpointsaveQuery = `
        insert into PointUse (useridx,pointsave,orderidx)(
            select  A.useridx,(A.paymentamount-ifnull(B.coupon,0)-ifnull(A.point,0))*0.03,A.orderid from
                (select OrderInfo.useridx,OrderInfo.storeidx,ifnull(PointUse.pointuse,0) as 'point',OrderInfo.orderidx as orderid,
                        (sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity)+(Delivery.deliveryaddtip+Store.deliverytip)) AS "paymentamount"
                 from OrderInfo inner join OrderItem on OrderInfo.orderidx=OrderItem.orderidx
                                inner join Store on Store.storeidx=OrderInfo.storeidx
                                join Delivery on Store.storeidx=Delivery.storeidx
                                join Useraddress  on Useraddress.dongname=Delivery.dongname  and Useraddress.base=0
                                join User on Useraddress.useridx=User.useridx and OrderInfo.useridx=Useraddress.useridx
                                join Menu on Menu.storeidx=Delivery.storeidx and  Menu.menuidx=OrderItem.menuidx
                                join ShoppingBasket on Menu.menuidx=ShoppingBasket.menuidx and OrderInfo.basketidx=ShoppingBasket.basketidx
                                join Menudetail on ShoppingBasket.menudetailidx=Menudetail.menudetailidx
                                left join PointUse on OrderInfo.orderidx= PointUse.orderidx
                 where  OrderInfo.useridx=? and OrderInfo.orderidx=? and paymentoption=0
                 group by OrderItem.orderidx)as A
                    left join (
                    select ifnull(Coupon.coupondiscount,0) as 'coupon',Coupon.couponidx,OrderInfo.useridx,OrderInfo.storeidx
                    from Coupon right join OrderInfo on OrderInfo.storeidx=Coupon.storeidx
                                right join Havecoupon on Havecoupon.useridx=OrderInfo.useridx
                        and Coupon.couponidx=Havecoupon.couponidx) as B
                              on A.useridx=B.useridx and A.storeidx=B.storeidx);
    `;
    const insertpointsaveRow = await connection.query(
        insertpointsaveQuery,
        insertpointsaveParams
    );

    return insertpointsaveRow;
}

// 유저 검색내용 생성
async function insertsearchcontent(connection, insertsearchcontentParams) {
    const insertsearchcontentQuery = `
        INSERT INTO Search(useridx,searchcontent)
        VALUES (?,?);
    `;
    const insertsearchcontentRow = await connection.query(
        insertsearchcontentQuery,
        insertsearchcontentParams
    );

    return insertsearchcontentRow;
}

// 유저 주소 생성
/*
async function insertuseraddress(connection, insertuseraddressParams) {
    const insertuseraddressQuery = `
        INSERT INTO Useraddress(useridx,useraddress,dongname,latitude,longitude,base)
        VALUES (?,?,?,?,?,?);
    `;
    const insertuseraddressRow = await connection.query(
        insertuseraddressQuery,
        insertuseraddressParams
    );

    return insertuseraddressRow;
}*/

// 유저 주소 생성2
async function insertuseraddress(connection, insertuseraddressParams) {
    const insertuseraddressQuery = `
        INSERT INTO Useraddress(useridx,useraddress,dongname,latitude,longitude,base)
        VALUES (?,?,?,?,?,?);
    `;
    const insertuseraddressRow = await connection.query(
        insertuseraddressQuery,
        insertuseraddressParams
    );

    return insertuseraddressRow;
}

//유저 쿠폰 등록
async function insertusercoupon(connection, insertusercouponParams) {
    const insertusercouponQuery = `
        INSERT INTO Havecoupon(useridx,couponidx)
        VALUES (?,?);
    `;
    const insertusercouponRow = await connection.query(
        insertusercouponQuery,
        insertusercouponParams
    );

    return insertusercouponRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
        SELECT useremail, username, userpassword
        FROM User
        WHERE useremail = ? AND userpassword = ?`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );

    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, useremail) {
    const selectUserAccountQuery = `
        SELECT status, useridx
        FROM User
        WHERE useremail = ?;`;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        useremail
    );
    return selectUserAccountRow[0];

}

async function updateUserInfo(connection, useridx,username ) {
    const updateUserQuery = `
  UPDATE User
  SET username = ?
  WHERE useridx = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [username,useridx]);
    return updateUserRow[0];
}

//유저 주소 삭제
async function updateuseraddress(connection, useridx,useraddress,status) {
    const updateuseraddressQuery = `
  UPDATE Useraddress
  SET status = 'N'
  WHERE useridx=? and useraddress = ? ;`;
    const updateuseraddressRow = await connection.query(updateuseraddressQuery, [useridx,useraddress,status]);
    return updateuseraddressRow[0];
}

//유저 기본주소 변경
async function updateuserbaseaddress(connection, useridx,useraddress,base) {
    const updateuserbaseaddressQuery = `
  UPDATE Useraddress
  SET base=0
  WHERE useridx=? and useraddress = ? ;`;
    const updateuserbaseaddressRow = await connection.query(updateuserbaseaddressQuery, [useridx,useraddress,base]);
    return updateuserbaseaddressRow[0];
}

//유저 탈퇴
async function updateuserstatus(connection, useridx,status) {
    const updateuserstatusQuery = `
  UPDATE User
  SET status = 2
  WHERE useridx=? `;
    const updateuserstatusRow = await connection.query(updateuserstatusQuery, [useridx,status]);
    return updateuserstatusRow[0];
}

module.exports = {
    selectUser,
    selectUserEmail,
    selectUserID,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    updateUserInfo,
    selectlikestore,
    selectorderlist,
    selectusercoupon,
    selectsearchlist,
    insertlikestore,
    selectmyreview,
    selectstoreID,
    insertsearchcontent,
    insertusercoupon,
    selectcouponidx,
    selectuserpoint,
    selectuseraddress,
    insertuseraddress,
    selectbaseaddress,
    updateuserlikestore,
    updateuseraddress,
    insertpointuse,
    selectorderID,
    insertpointsave,
    selectuserorderID,
    updateuserbaseaddress,
    updateuserstatus,
    selectuserlikestorestatus
};
