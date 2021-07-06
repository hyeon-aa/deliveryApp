// 모든 유저 조회
async function selectUser(connection) {
    const selectUserListQuery = `
                SELECT useremail, username 
                FROM User;
                `;
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, useremail) {
    const selectUserEmailQuery = `
                SELECT useremail, username
                FROM User 
                WHERE useremail = ?;
                `;
    const [emailRows] = await connection.query(selectUserEmailQuery, useremail);
    return emailRows;
}

//음식점 카테고리 리스트 조회
async function selectstorecategorylist(connection, storeidx) {
    const selectstorecategorylistQuery = `
         select categoryname
        from Store
        group by categoryidx;
    `;
    const [storecategorylistRow] = await connection.query(selectstorecategorylistQuery, storeidx);
    console.log(storeidx);
    return storecategorylistRow;
}


// 음식점 상세정보 조회
async function selectStoreidx(connection, storeidx) {
    const selectstoreidxQuery = `
        select Store.storename,round(avg(Review.userstarRating),1) as 'totalstarrate' ,count(Review.reviewidx) as 'reviewnum',count(Boss.bosscommentidx) as 'bossreviewnum',Store.storephoneNum ,
               Store.deliveryexpectTime ,Store.deliverytip ,Store.orderamountmin
                ,Store.paymentmethod,
               (select count(Userlikestore.useridx) from Userlikestore where Store.storeidx=Userlikestore.storeidx group by storeidx)'likenum'
        from Store left join Review on Store.storeidx=Review.storeidx
                    left join Boss on Review.reviewidx=Boss.reviewidx
        where Store.storeidx=3
        group by Store.storeidx;
    `;
    const [storeRow] = await connection.query(selectstoreidxQuery, storeidx);
    console.log(storeidx);
    return storeRow;
}

//음식점 메뉴조회
async function selectmenubyStoreidx(connection, storeidx) {
    //대표메뉴
    const selectrmenustoreidxQuery = `
        select Menu.menuname,Menu.menuprice,Menu.menuimage,Menu.status,popular as 'popular'
        from Menu,Store where Store.storeidx=Menu.storeidx
                          and Menu.storeidx=? and Menu.representative='Y';
    `;
    const [rmenustoreRow] = await connection.query(selectrmenustoreidxQuery, storeidx);
    //메뉴 카테고리
    const selectmenucategoryQuery = `     
    select Menucategory.menucate as 'menucategory',menucategoryidx
    from Menucategory
        where storeidx=?
        GROUP BY Menucategory.menucate; 
    `;
    const [menucategoryRow] = await connection.query(selectmenucategoryQuery, storeidx);
    console.log(menucategoryRow);
    //카테고리별 메뉴
    for (j in menucategoryRow) {
        const selectmenubycategoryQuery = `
            select Menu.menuname,
                   Menu.menuprice,
                   Menudetail.addmenu,
                   Menudetail.addtip
            from Menucategory
                     inner join Menu on Menucategory.menuidx = Menu.menuidx
                     inner join Menudetail on Menu.menuidx = Menudetail.menuidx
            where Menucategory.menucategoryidx=${menucategoryRow[j].menucategoryidx} 
        `;
        const [menubycategoryRow] = await connection.query(selectmenubycategoryQuery,
            menucategoryRow[j].menucategoryidx);
        menucategoryRow[j].catemenu= menubycategoryRow;
    }
    //원산지 표기
    const selectmenuoriginQuery= `
        select countryoforigin
        from StoreInfo
        where StoreInfo.storeidx=?;
    `;
    const [menuoriginRow] = await connection.query(selectmenuoriginQuery, storeidx);
    menuarray=[];
    menuarray.push(rmenustoreRow);
    menuarray.push(menucategoryRow);
    menuarray.push(menuoriginRow);
    return menuarray;
}

//주소에 따른 카테고리별 음식점 조회
async function selectcategorystoreidx(connection, [categoryidx,useridx,sort,page,size]) {
    var selectcategorystoreidxQuery = `
        select * from (
            SELECT storename,deliveryexpectTime AS 'deliverytime',orderamountmin,deliveryTip,takeout,round(avg(userstarRating),1) as 'starrate',storeimage
    ,case  when count(OrderInfo.useridx)=0 then 0
           when count(OrderInfo.useridx)=1 then 1
           when count(OrderInfo.useridx)=2 then 2
           when count(OrderInfo.useridx)=3 then 3
           when 20<=count(OrderInfo.useridx)<50 then concat(cast(20 as char(15)),'+')
           when 50<=count(OrderInfo.useridx)<100 then concat(cast(50 as char(15)),'+')
           else concat(cast(100 as char(15)),'+')
                              end as orderc
                               ,case when timestampdiff(day,Store.createdAt,current_timestamp())<30
                                         then 'new' end as new
                               ,(select 'Y' from Coupon where Store.storeidx=Coupon.couponidx) as 'iscoupon'
                          from Review right outer join Store on (Review.storeidx=Store.storeidx)
                                      left outer join OrderInfo on(Review.orderidx=OrderInfo.orderidx)
                          where Store.categoryidx=? and Store.status='Y'
                   
                          group by Store.storeidx)as A
                          inner join (
            SELECT storename
            FROM (
                     SELECT ( 6371 * acos( cos( radians(Useraddress.latitude ) ) * cos( radians( Store.latitude) ) * cos( radians( Store.longitude )
                         - radians(Useraddress.longitude) ) + sin( radians(Useraddress.latitude) ) * sin( radians(Store.latitude) ) ) ) AS distance
                          ,Store.storename
                     FROM Useraddress join Store
                     where  Useraddress.useridx=? and Useraddress.base=0
                 ) DATA
            WHERE DATA.distance < 5)as B
                                     on A.storename=B.storename `;
    if (!sort || sort == 0) {
        selectcategorystoreidxQuery += `order by starrate DESC `;
    }
    else if (sort == 1) {
        selectcategorystoreidxQuery += `order by orderc DESC`;
    }
    else if (sort == 2) {
        selectcategorystoreidxQuery += `order by deliveryTip asc`;
    }
    else if (sort == 3) {
        selectcategorystoreidxQuery += `order by distance asc`;
    }
    if(page){
        selectcategorystoreidxQuery += ` LIMIT ${size * (page - 1)},${size}`
    }
    const [categorystoreRow] = await connection.query(selectcategorystoreidxQuery, [categoryidx,useridx,sort,page,size]);
    console.log(categoryidx);
    return categorystoreRow;
}



//주소에 따른 카테고리별 음식점 조회2(현재위치에따라서)
/*
async function selectcategorystoreidx(connection, [categoryidx,useridx,lat,long,sort,page,size]) {
    var selectcategorystoreidxQuery = `
        select * from (
            SELECT storename,deliveryexpectTime AS 'deliverytime',orderamountmin,deliveryTip,takeout,round(avg(userstarRating),1) as 'starrate',storeimage
    ,case  when count(OrderInfo.useridx)=0 then 0
           when count(OrderInfo.useridx)=1 then 1
           when count(OrderInfo.useridx)=2 then 2
           when count(OrderInfo.useridx)=3 then 3
           when 20<=count(OrderInfo.useridx)<50 then concat(cast(20 as char(15)),'+')
           when 50<=count(OrderInfo.useridx)<100 then concat(cast(50 as char(15)),'+')
           else concat(cast(100 as char(15)),'+')
                              end as orderc
                               ,case when timestampdiff(day,Store.createdAt,current_timestamp())<30
                                         then 'new' end as new
                               ,(select 'Y' from Coupon where Store.storeidx=Coupon.couponidx) as 'iscoupon'
                          from Review right outer join Store on (Review.storeidx=Store.storeidx)
                                      left outer join OrderInfo on(Review.orderidx=OrderInfo.orderidx)
                          where Store.categoryidx=? and Store.status='Y'
                            and current_time between Store.opentime and Store.closetime
                          group by Store.storeidx)as A
                          inner join (
            SELECT storename,distance
            FROM (
                     SELECT ( 6371 * acos( cos( radians(${lat} ) ) * cos( radians( Store.latitude) ) * cos( radians( Store.longitude )
                         - radians(${long}) ) + sin( radians(${lat}) ) * sin( radians(Store.latitude) ) ) ) AS distance
                          ,Store.storename
                     FROM  Store
                 ) DATA
            WHERE DATA.distance < 5)as B
                                     on A.storename=B.storename `;

    console.log('sort',sort);
    if (!sort || sort == 0) {
        selectcategorystoreidxQuery += `order by starrate DESC `;
    }
    else if (sort == 1) {
        selectcategorystoreidxQuery += `order by orderc DESC`;
    }
    else if (sort == 2) {
        selectcategorystoreidxQuery += `order by deliveryTip asc`;
    }
    else if (sort == 3) {
        selectcategorystoreidxQuery += `order by distance asc`;
    }
    if(page){
        selectcategorystoreidxQuery += ` LIMIT ${size * (page - 1)},${size}`
    }

    const [categorystoreRow] = await connection.query(selectcategorystoreidxQuery,[categoryidx,useridx,lat,long,sort,page,size]);
    //console.log(categoryidx);
    return categorystoreRow;
}
*/

//가게 상세정보 조회
async function selectstoredetail(connection, storeidx) {
    const selectstoredetailQuery = `
        select storeIntro,announce,saleInfo,businessInfo,deliverytipannounce 
        from StoreInfo where storeidx=?;
    `;
    const [storedetailRow] = await connection.query(selectstoredetailQuery, storeidx);
    console.log(storeidx);
    return storedetailRow;
}


module.exports = {
    selectUser,
    selectUserEmail,
    selectStoreidx,
    selectcategorystoreidx,
    selectstoredetail,
    selectstorecategorylist,
    selectmenubyStoreidx
};