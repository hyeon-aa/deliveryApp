module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport')
    const KakaoStrategy = require('passport-kakao').Strategy;
    const NaverStrategy = require('passport-naver').Strategy;

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users/create', user.postUsers);

    //가게 찜 등록
    app.post('/app/users/mylikestore',jwtMiddleware, user.postlikestores);

    //유저 검색내용 등록
    app.post('/app/users/search-content', jwtMiddleware,user.postsearchcontent);

    //유저 쿠폰 등록
    app.post('/app/users/new-coupon', jwtMiddleware,user.postnewcoupon);

    //유저 주소 등록
    app.post('/app/users/address',jwtMiddleware,  user.postaddress);

    //유저 포인트 사용
    app.post('/app/users/points',jwtMiddleware,  user.postpointuse);

    //유저 포인트 적립
    app.post('/app/users/savepoint',jwtMiddleware,  user.postpointsave);

    //*유저 쿠폰 조회
    app.get('/app/users/coupon',jwtMiddleware, user.getusercoupon);

    //*유저 주소 조회
    app.get('/app/users/address',jwtMiddleware, user.getuseraddress);

    //*유저 포인트 조회
    app.get('/app/users/point', jwtMiddleware, user.getuserpoint);

    //*유저 포인트 내역 조회
    app.get('/app/users/pointinfo', jwtMiddleware, user.getuserpointinfo);

    //*유저 포인트 전체 조회
    app.get('/app/users/pointdetail', jwtMiddleware, user.getuserpointdetail);

    //* 찜한 가게 조회 API
    app.get('/app/users/like-store',jwtMiddleware, user.getlikestoreById);

    //*주문내역조회
    app.get('/app/users/orderlist',jwtMiddleware, user.getorderlistById);

    //*유저 검색내역 조회
    app.get('/app/users/search',jwtMiddleware, user.getusersearch);

    //*내가쓴 리뷰 정보조회
    app.get('/app/users/myreviewInfo',jwtMiddleware, user.getmyreviewInfo);

    //특정 유저 조회 API
    app.get('/app/users/myInfo',jwtMiddleware, user.getUserById);

    // 로그인 하기 API (JWT 생성)
    app.post('/app/signin', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation)
    app.patch('/app/users/:useridx', jwtMiddleware, user.patchUsers)

    //가게 찜 취소
    app.patch('/app/users/mylikestores/:useridx/status',jwtMiddleware, user.patchlikestores);

    //유저 주소 삭제
    app.patch('/app/users/address/:useridx/status',jwtMiddleware, user.patchuseraddress);

    //유저 기본주소 변경
    app.patch('/app/users/address/:useridx/base',jwtMiddleware, user.patchuserbaseaddress);

    //유저 탈퇴
    app.patch('/app/users/:useridx/status',jwtMiddleware, user.patchuserstatus);

    //카카오로그인
    app.get('/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/', }), (req, res) => { res.redirect('/'); });

    //네이버로그인
    app.get('/naver', passport.authenticate('naver-login'));
    app.get('/auth/naver/callback', passport.authenticate('naver-login', { failureRedirect: '/', }), (req, res) => { res.redirect('/'); });

};


// 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

