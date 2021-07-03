//상세주문정보
async function selectorderInfo(connection, [useridx,orderidx]) {
    //주문정보
    const selectorderInfoQuery = `
        select storename,deliverystatus,(A.paymentamount-ifnull(B.coupon,0)-ifnull(pointuse,0))as 'paymentamount',orderamount,deliverytip,orderdate,orderidx,ordermenu,
               ifnull(B.coupon,0)as 'coupond',ifnull(pointuse,0) as 'point',paymethod,orderdate,useraddress,userphoneNum,storerequest,riderrequest from
            (select  OrderInfo.deliverystatus,Store.storename,sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity ) as "orderamount", (Delivery.deliveryaddtip+Store.deliverytip) as "deliverytip"
                  ,(sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity)+(Delivery.deliveryaddtip+Store.deliverytip)) AS "paymentamount"
                  ,(OrderInfo.paymentoption)AS 'paymethod',OrderInfo.useridx,OrderInfo.storeidx
                  ,(OrderInfo.updatedAt)AS "orderdate",OrderInfo.orderidx,ordermenu,
                 Useraddress.useraddress,User.userphoneNum,OrderInfo.storerequest,OrderInfo.riderrequest,PointUse.pointuse
             from (select OrderItem.orderidx,
                          case when count(OrderItem.menuidx)=1 then Menu.menuname
                               else concat(Menu.menuname ,' 외 ', cast(count(OrderItem.menuidx)-1 AS char(15))) end as ordermenu
                   from OrderItem, Menu where Menu.menuidx=OrderItem.menuidx group by OrderItem.orderidx) OI
                      inner join OrderInfo on OrderInfo.orderidx=OI.orderidx
                      inner join Store on Store.storeidx=OrderInfo.storeidx
                      join Delivery on Store.storeidx=Delivery.storeidx
                      join Useraddress  on Useraddress.dongname=Delivery.dongname  and Useraddress.base=0
                      join User on Useraddress.useridx=User.useridx and OrderInfo.useridx=Useraddress.useridx
                      join Menu on Menu.storeidx=Delivery.storeidx
                      join ShoppingBasket on Menu.menuidx=ShoppingBasket.menuidx and OrderInfo.basketidx=ShoppingBasket.basketidx
                      join Menudetail on ShoppingBasket.menudetailidx=Menudetail.menudetailidx
                      left join PointUse on OrderInfo.orderidx= PointUse.orderidx
             where  OrderInfo.useridx=? and OrderInfo.orderidx=?)as A
                left join (
                select ifnull(Coupon.coupondiscount,0) as 'coupon',Coupon.couponidx,OrderInfo.useridx,OrderInfo.storeidx
                from Coupon right join OrderInfo on OrderInfo.storeidx=Coupon.storeidx
                            right join Havecoupon on Havecoupon.useridx=OrderInfo.useridx
                    and Coupon.couponidx=Havecoupon.couponidx) as B
                          on A.useridx=B.useridx and A.storeidx=B.storeidx;
    `;
    //주문메뉴
    const selectorderInfomenuQuery = `
        select Menu.menuname,((Menudetail.addtip)+(Menu.menuprice))as 'price',Menudetail.addmenu,ShoppingBasket.menuquantity
        from OrderInfo join OrderItem on OrderInfo.orderidx=OrderItem.orderidx
                       join Menu on OrderItem.menuidx=Menu.menuidx
                       join Menudetail on OrderItem.menudetailidx=Menudetail.menudetailidx
                       left join ShoppingBasket on OrderInfo.basketidx=ShoppingBasket.basketidx and ShoppingBasket.menudetailidx=OrderItem.menudetailidx
        where  OrderInfo.orderidx=?;
    `;
    const [orderInfoRow] = await connection.query(selectorderInfoQuery,[useridx,orderidx]);
    const [orderInfomenuRow] = await connection.query(selectorderInfomenuQuery, [useridx,orderidx]);
    orderInfoarray=[];
    orderInfoarray.push(orderInfoRow);
    orderInfoarray.push(orderInfomenuRow);
    return orderInfoarray;
}



//장바구니 조회
async function selectshoppingbasket(connection, [useridx,basketidx]) {
    //장바구니 메뉴
    const selectshoppingbasketQuery = `
        select Menu.menuname,((Menudetail.addtip)+(Menu.menuprice))as 'price',ShoppingBasket.menuquantity,sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity) as totalprice
             ,Menudetail.addmenu
        from Menu inner join ShoppingBasket
                             on Menu.menuidx=ShoppingBasket.menuidx and ShoppingBasket.basketidx=?
                  join Menudetail on Menudetail.menudetailidx=ShoppingBasket.menudetailidx
        group by addmenu,menuname
    `;
    //장바구니 가격 합
    const selectshoppingbaskettotQuery = `
        select sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity) as baskettotal
        from Menu inner join ShoppingBasket
                             on Menu.menuidx=ShoppingBasket.menuidx and ShoppingBasket.basketidx=?
                  join Menudetail on Menudetail.menudetailidx=ShoppingBasket.menudetailidx
        group by ShoppingBasket.basketidx;
    `;
    const [shoppingbasketRow] = await connection.query(selectshoppingbasketQuery,basketidx);
    const [shoppingbaskettotRow] = await connection.query(selectshoppingbaskettotQuery , basketidx);
    shoppingbasketarray=[];
    shoppingbasketarray.push(shoppingbasketRow);
    shoppingbasketarray.push(shoppingbaskettotRow);
    return shoppingbasketarray;
}


//장바구니 메뉴 등록
async function insertbasketmenu(connection, insertbasketmenuParams) {
    const insertbasketmenuQuery = `
        INSERT INTO ShoppingBasket(useridx,basketidx,menuidx,menudetailidx,menuquantity)
        VALUES (?,?,?,?,?);
    `;
    const insertbasketmenuRow = await connection.query(
        insertbasketmenuQuery,
        insertbasketmenuParams
    );

    return insertbasketmenuRow;
}

// userId 회원 조회
async function selectUserID(connection, useridx) {
    const selectUserIDQuery = `
        SELECT useridx, useremail, username,usergrade
        FROM User
        WHERE useridx = ?;
    `;
    const [userRow] = await connection.query(selectUserIDQuery, useridx);
    return userRow;
}

//장바구니 전체 삭제
async function updatebasket(connection, useridx,basketidx,status) {
    const updatebasketQuery = `
  UPDATE ShoppingBasket
  SET status = 'N'
  WHERE useridx = ? and basketidx =? ;`;
    const updatebasketRow = await connection.query(updatebasketQuery, [useridx,basketidx,status]);
    return updatebasketRow[0];
}

//장바구니 메뉴 삭제
async function updatebasketmenu(connection, useridx,basketidx,menuidx,menudetailidx,status) {
    const updatebasketmenuQuery = `
  UPDATE ShoppingBasket
  SET status = 'N'
  WHERE useridx = ? and basketidx =? and menuidx=? and menudetailidx=?;`;
    const updatebasketmenuRow = await connection.query(updatebasketmenuQuery, [useridx,basketidx,menuidx,menudetailidx,status]);
    return updatebasketmenuRow[0];
}

//장바구니번호
async function selectbasketID(connection, basketidx) {
    const selectbasketIDQuery = `
        SELECT  basketidx
        FROM ShoppingBasket
        WHERE basketidx = ?;
    `;
    const [basketRow] = await connection.query(selectbasketIDQuery, basketidx);
    return basketRow;
}

//최소주문금액
async function selectbasketmin(connection, basketidx) {
    const selectbasketminQuery = `
        select sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity) as 'basketm',Store.orderamountmin
        from  Menu join ShoppingBasket on Menu.menuidx=ShoppingBasket.menuidx
                   join Menudetail on ShoppingBasket.menudetailidx=Menudetail.menudetailidx
                   join Store on Store.storeidx=Menu.storeidx
        where basketidx=?;
    `;
    const [basketminRow] = await connection.query(selectbasketminQuery, basketidx);
    return basketminRow;
}

// 메뉴 조회
async function selectmenuID(connection, menuidx) {
    const selectmenuIDQuery = `
        SELECT menuidx
        FROM Menu
        WHERE menuidx = ?;
    `;
    const [menuRow] = await connection.query(selectmenuIDQuery, menuidx);
    return menuRow;
}

//장바구니 수정
async function updatebasketinfo(connection,menuidx,menudetailidx,menuquantity,useridx,basketidx) {
    const updatebasketinfoQuery = `
        UPDATE ShoppingBasket
        SET menuidx=? ,menudetailidx=? ,menuquantity=?
        WHERE useridx=? and basketidx = ?;`;
    const updatebasketinfoRow = await connection.query(updatebasketinfoQuery, [menuidx,menudetailidx,menuquantity,useridx,basketidx]);
    return updatebasketinfoRow[0];
}



module.exports ={
    selectorderInfo,
    selectshoppingbasket,
    insertbasketmenu,
    selectUserID,
    updatebasket,
    selectbasketID,
    selectbasketmin,
    selectmenuID,
    updatebasketmenu,
    updatebasketinfo
};
