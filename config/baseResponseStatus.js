module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    BASKETF_SUCCESS: { "isSuccess": true, "code": 1001, "message":"장바구니 최종 정보 조회 성공" },
    ORDERINFOTOT_SUCCESS: { "isSuccess": true, "code": 1002, "message":"총 상세주문정보 조회 성공" },
    COUPON_SUCCESS: { "isSuccess": true, "code": 1003, "message":"유저 쿠폰 정보 조회 성공" },
    SEARCHINFO_SUCCESS: { "isSuccess": true, "code": 1004, "message":"유저 검색내역 조회 성공" },
    ORDERLIST_SUCCESS: { "isSuccess": true, "code": 1005, "message":"유저 주문내역 조회 성공" },
    LIKESTORE_SUCCESS: { "isSuccess": true, "code": 1006, "message":"유저 찜한 가게 조회 성공" },
    MYREVIEW_SUCCESS: { "isSuccess": true, "code": 1007, "message":"유저 리뷰 조회 성공" },
    REVIEW_SUCCESS: { "isSuccess": true, "code": 1008, "message":"유저 작성 성공" },
    REVIEWBOARD_SUCCESS: { "isSuccess": true, "code": 1009, "message":"음식점 리뷰보드 조회 성공" },
    STOREDETAIL_SUCCESS: { "isSuccess": true, "code": 1010, "message":"음식점 상세정보 조회 성공" },
    STOREINFO_SUCCESS: { "isSuccess": true, "code": 1011, "message":"특정 음식점정보 조회 성공" },
    STOREBYCATEGORY_SUCCESS: { "isSuccess": true, "code": 1012, "message":"카테고리별 음식점 조회 성공" },
    REVIEWGRAPH_SUCCESS: { "isSuccess": true, "code": 1013, "message":"리뷰 그래프 조회 성공" },
    REVIEWCOMMENTNUM_SUCCESS: { "isSuccess": true, "code": 1014, "message":"리뷰 총 댓글수와 사장님 댓글수 조회 성공" },
    STORECATEGORYLIST_SUCCESS: { "isSuccess": true, "code": 1015, "message":"음식점 카테고리리스트 조회 성공" },
    POINT_SUCCESS: { "isSuccess": true, "code": 1016, "message":"유저 포인트 정보 조회 성공" },
    ADDRESS_SUCCESS: { "isSuccess": true, "code": 1017, "message":"유저 최근주소 정보 조회 성공" },
    RANK_SUCCESS: { "isSuccess": true, "code": 1018, "message":"검색순위 조회 성공" },
    STOREMENU_SUCCESS: { "isSuccess": true, "code": 1019, "message":"음식점 메뉴 조회 성공" },
    USER_SUCCESS : { "isSuccess": true, "code": 1020, "message":"특정유저 조회 성공" },
    BASKET_ORDER_SUCCESS : { "isSuccess": true, "code": 1021, "message": "주문 가능합니다" },

    STORE_STOREIDX_EMPTY : { "isSuccess": false, "code": 2030, "message": "storeIdx를 입력해주세요." },
    STORE_CATEGORYIDX_EMPTY : { "isSuccess": false, "code": 2031, "message": "categoryIdx를 입력해주세요." },
    USER_DONGNAME_EMPTY : { "isSuccess": false, "code": 2050, "message": "동 이름을 입력해주세요." },
    USER_LONGITUDE_EMPTY : { "isSuccess": false, "code": 2051, "message": "경도를 입력해주세요." },
    USER_LATITUDE_EMPTY : { "isSuccess": false, "code": 2052, "message": "위도를 입력해주세요." },
    USER_BASE_EMPTY : { "isSuccess": false, "code": 2053, "message": "기본주소 여부를 입력해주세요." },
    USER_ADDRESS_EMPTY : { "isSuccess": false, "code": 2054, "message": "주소를 입력해주세요." },


    MENU_MENUIDX_EMPTY : { "isSuccess": false, "code": 2024, "message":" 메뉴를 입력해주세요." },
    MENU_MENUDETAILIDX_EMPTY : { "isSuccess": false, "code": 2025, "message":" 추가메뉴를 선택해주세요." },
    MENU_MENUQUANTITY_EMPTY : { "isSuccess": false, "code": 2026, "message":" 메뉴의 수량을 선택해주세요." },
    SEARCH_SEARCHCONTENT_EMPTY : { "isSuccess": false, "code": 2027, "message":" 검색어를 입력해주세요." },

    REVIEWCOMMENT_LENGTH : { "isSuccess": false, "code": 2020, "message":"리뷰는 5자리 이상으로 입력해주세요." },
    SEARCHCONTENT_LENGTH : { "isSuccess": false, "code": 2021, "message":"검색내용은 2자리 이상으로 입력해주세요." },
    REVIEWCOMMENT_EMPTY : { "isSuccess": false, "code": 2022, "message":" 리뷰를 입력해주세요." },
    STARRATING_EMPTY : { "isSuccess": false, "code": 2028, "message":" 별점을 입력해주세요." },
    STARRATING_LENGTH : { "isSuccess": false, "code": 2023, "message":"별점은  1~5점으로 입력해주세요." },
    LATITUDE_LENGTH : { "isSuccess": false, "code": 2055, "message":"위도는 33~43으로 입력해주세요." },
    LONGITUDE_LENGTH : { "isSuccess": false, "code": 2056, "message":"경도는 124~132로 입력해주세요." },
    BASEADDRESS_ONLY_ONE : { "isSuccess": false, "code": 2057, "message":"기본 주소는 하나만 가능합니다." },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 5~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SIGNUP_PHONENUM_EMPTY : { "isSuccess": false, "code": 2036, "message": "휴대폰 번호를 입력해주세요." },

    SIGNUP_USERIDX_EMPTY : { "isSuccess": false, "code": 2001, "message":"유저idx를 입력해주세요" },
    STORE_STOREIDX_EMPTY : { "isSuccess": false, "code": 2020, "message": "storeidx를 입력해주세요." },
    COUPON_COUPONIDX_EMPTY : { "isSuccess": false, "code": 2032, "message": "쿠폰번호를 입력해주세요." },
    BASKET_BASKETIDX_EMPTY : { "isSuccess": false, "code": 2033, "message": "basketidx를 입력해주세요." },
    ORDER_ORDERIDX_EMPTY : { "isSuccess": false, "code": 2034, "message": "orderidx를 입력해주세요." },
    REVIEW_REVIEWIDX_EMPTY : { "isSuccess": false, "code": 2034, "message": "reviewidx를 입력해주세요." },
    POINT_POINTUSE_EMPTY : { "isSuccess": false, "code": 2060, "message": "사용할 포인트를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PHONE_ERROR_TYPE : { "isSuccess": false, "code": 2061, "message":"전화번호 형식을 정확하게 입력해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2019, "message": "해당 회원이 존재하지 않습니다." },
    STORE_STOREID_NOT_EXIST : { "isSuccess": false, "code": 2024, "message": "해당 음식점이 존재하지 않습니다." },
    ORDER_ORDERID_NOT_EXIST : { "isSuccess": false, "code": 2025, "message": "해당 주문이 존재하지 않습니다." },
    COUPON_COUPONIDX_NOT_EXIST : { "isSuccess": false, "code": 2026, "message": "해당 쿠폰이 존재하지 않습니다." },
    BASKET_BASKETIDX_NOT_EXIST : { "isSuccess": false, "code": 2058, "message": "해당 장바구니가 존재하지 않습니다." },
    USER_USERORDERIDX_NOT_EXIST : { "isSuccess": false, "code": 2058, "message": "회원의 주문번호가 아닙니다." },
    BASKET_MIN : { "isSuccess": false, "code": 2060, "message": "최소금액 이상 주문 가능합니다" },
    MENU_MENUID_NOT_EXIST : { "isSuccess": false, "code": 2061, "message": "해당 메뉴가 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },
    USER_ADDRESS_EMPTY : { "isSuccess": false, "code": 2037, "message": "유저 주소를 입력해주세요" },
    USER_NAME_EMPTY : { "isSuccess": false, "code": 2059, "message": "변경할 이름을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
