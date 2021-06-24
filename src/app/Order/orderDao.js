//주문정보조회
async function selectorderInfo(connection, orderidx) {
    const selectorderInfoQuery = `
        select storename,deliverystatus,(A.paymentamount-ifnull(B.coupon,0))as 'paymentamount',orderamount,deliverytip,orderdate,orderidx,ordermenu,
               ifnull(B.coupon,0)as 'coupond',paymentoption,orderdate,useraddress,userphoneNum,storerequest,riderrequest from
            (select  OrderInfo.deliverystatus,Store.storename,sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity ) as "orderamount", (Delivery.deliveryaddtip+Store.deliverytip) as "deliverytip"
                  ,(sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity)+(Delivery.deliveryaddtip+Store.deliverytip)) AS "paymentamount"
                  ,(OrderInfo.paymentoption)AS 'paymethod',OrderInfo.useridx,OrderInfo.storeidx
                  ,(OrderInfo.updatedAt)AS "orderdate",OrderInfo.orderidx,ordermenu,
                 Useraddress.useraddress,User.userphoneNum,OrderInfo.storerequest,OrderInfo.riderrequest
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
             where OrderInfo.orderidx=?)as A
                left join (
                select ifnull(Coupon.coupondiscount,0) as 'coupon',Coupon.couponidx,OrderInfo.useridx,OrderInfo.storeidx
                from Coupon right join OrderInfo on OrderInfo.storeidx=Coupon.storeidx
                            right join Havecoupon on Havecoupon.useridx=OrderInfo.useridx
                    and Coupon.couponidx=Havecoupon.couponidx) as B
                          on A.useridx=B.useridx and A.storeidx=B.storeidx;
    `;
    const [orderInfoRow] = await connection.query(selectorderInfoQuery,orderidx);
    return orderInfoRow;
}

//주문정보메뉴조회
async function selectorderInfomenu(connection, orderidx) {
    const selectorderInfomenuQuery = `
        select Menu.menuname,((Menudetail.addtip)+(Menu.menuprice))as 'price',Menudetail.addmenu,ShoppingBasket.menuquantity
        from OrderInfo join OrderItem on OrderInfo.orderidx=OrderItem.orderidx
                       join Menu on OrderItem.menuidx=Menu.menuidx
                       join Menudetail on OrderItem.menudetailidx=Menudetail.menudetailidx
                       left join ShoppingBasket on OrderInfo.basketidx=ShoppingBasket.basketidx and ShoppingBasket.menudetailidx=OrderItem.menudetailidx
        where  OrderInfo.orderidx=?;
    `;
    const [orderInfomenuRow] = await connection.query(selectorderInfomenuQuery, orderidx);
    return orderInfomenuRow;
}


//장바구니 조회
async function selectshoppingbasket(connection, basketidx) {
    const selectshoppingbasketQuery = `
        select Menu.menuname,((Menudetail.addtip)+(Menu.menuprice))as 'price',ShoppingBasket.menuquantity,sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity) as totalprice
             ,Menudetail.addmenu
        from Menu inner join ShoppingBasket
                             on Menu.menuidx=ShoppingBasket.menuidx and ShoppingBasket.basketidx=?
                  join Menudetail on Menudetail.menudetailidx=ShoppingBasket.menudetailidx
        group by addmenu,menuname;
    `;
    const [shoppingbasketRow] = await connection.query(selectshoppingbasketQuery, basketidx);
    return shoppingbasketRow;
}

//장바구니 합계 조회
async function selectshoppingbaskettot(connection, basketidx) {
    const selectshoppingbaskettotQuery = `
        select sum(((Menudetail.addtip)+(Menu.menuprice))*ShoppingBasket.menuquantity) as baskettotal
        from Menu inner join ShoppingBasket
                             on Menu.menuidx=ShoppingBasket.menuidx and ShoppingBasket.basketidx=?
                  join Menudetail on Menudetail.menudetailidx=ShoppingBasket.menudetailidx
        group by ShoppingBasket.basketidx;
    `;
    const [shoppingbaskettotRow] = await connection.query(selectshoppingbaskettotQuery, basketidx);
    return shoppingbaskettotRow;
}

//장바구니 메뉴 등록
async function insertbasketmenu(connection, insertbasketmenuParams) {
    const insertbasketmenuQuery = `
        INSERT INTO ShoppingBasket(useridx,basketidx,menuidx,menudetailidx,menuquantity)
        VALUES (?, ?,?,?,?);
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


module.exports ={
    selectorderInfo,
    selectorderInfomenu,
    selectshoppingbasket,
    selectshoppingbaskettot,
    insertbasketmenu,
    selectUserID
};