module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 1. 유저 생성 (회원가입) API
    app.post('/app/users/create', user.postUsers);

    //가게 찜 등록
    app.post('/app/users/mylikestores',jwtMiddleware, user.postlikestores);

    //유저 검색내용 등록
    app.post('/app/users/search-contents', jwtMiddleware,user.postsearchcontent);

    //유저 쿠폰 등록
    app.post('/app/users/new-coupons', jwtMiddleware,user.postnewcoupon);

    //유저 주소 등록
    app.post('/app/users/addresses',jwtMiddleware,  user.postaddress);

    //유저 포인트 사용
    app.post('/app/users/points',jwtMiddleware,  user.postpointuse);

    //유저 포인트 적립
    app.post('/app/users/savepoints',jwtMiddleware,  user.postpointsave);

    //*유저 쿠폰 조회
    app.get('/app/users/coupons',jwtMiddleware, user.getusercoupon);

    //*유저 주소 조회
    app.get('/app/users/addresses',jwtMiddleware, user.getuseraddress);

    //*유저 포인트 조회
    app.get('/app/users/points', jwtMiddleware, user.getuserpoint);

    //*유저 포인트 내역 조회
    app.get('/app/users/pointinfos', jwtMiddleware, user.getuserpointinfo);

    //*유저 포인트 전체 조회
    app.get('/app/users/pointdetails', jwtMiddleware, user.getuserpointdetail);

    //* 5. 찜한 가게 조회 API
    app.get('/app/users/like-stores',jwtMiddleware, user.getlikestoreById);

    //*6. 주문내역조회
    app.get('/app/users/orderlists',jwtMiddleware, user.getorderlistById);

    //*유저 검색내역 조회
    app.get('/app/users/searches',jwtMiddleware, user.getusersearch);

    //내가쓴 리뷰 조회
    app.get('/app/users/myreviews',jwtMiddleware, user.getmyreview);

    //내가쓴 리뷰 이미지 조회
    app.get('/app/users/myreviewimgs',jwtMiddleware, user.getmyreviewimg);

    //*내가쓴 리뷰 정보조회
    app.get('/app/users/myreviewInfos',jwtMiddleware, user.getmyreviewInfo);

    // 유저 조회 API (+ 검색)
    //app.get('/app/users',user.getUsers);

    //특정 유저 조회 API
    app.get('/app/users/myInfos',jwtMiddleware, user.getUserById);

    // 로그인 하기 API (JWT 생성)
    app.post('/app/signin', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation)
    app.patch('/app/users/:useridx', jwtMiddleware, user.patchUsers)

    //가게 찜 취소
    app.patch('/app/users/mylikestores/:useridx/status',jwtMiddleware, user.patchlikestores);

    //유저 주소 삭제
    app.patch('/app/users/address/:useridx/status',jwtMiddleware, user.patchuseraddress);

};


// 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

