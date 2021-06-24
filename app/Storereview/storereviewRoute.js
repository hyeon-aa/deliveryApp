module.exports = function(app) {
    const storereview = require('./storereviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //리뷰 등록
    app.post('/app/storereviewes/',jwtMiddleware, storereview.poststorereview);

    //리뷰 수정
    app.patch('/app/storereviewes/:useridx',jwtMiddleware, storereview.patchstorereviewcontent);

    //리뷰 삭제
    app.patch('/app/storereviewes/:useridx/status',jwtMiddleware, storereview.patchstorereview);

    //리뷰 리스트 조회
    app.get('/app/storereviewes/lists', storereview.getStorereviewList);

    //리뷰 메뉴추천여부 조회
    app.get('/app/storereviewes/menurecommends', storereview.getreviewmenurecommend);

    //리뷰 이미지 조회
    app.get('/app/storereviewes/imgs', storereview.getStorereviewimg);

    //*리뷰보드 조회
    app.get('/app/storereviewes/boards', storereview.getreviewBoard);

    //*리뷰 댓글 수 조회
    app.get('/app/storereviewes/commentnums', storereview.getStorereviewcommentNum);

    //별점 별 사람수 조회
    app.get('/app/storereviewes/starbypeoples', storereview.getreviewpeople);

    //월별 리뷰 조회
    app.get('/app/storereviewes/month', storereview.getmonthreview);

    //총 평점
    app.get('/app/storereviewes/totalstars', storereview.gettotalstar);

    //*리뷰 그래프
    app.get('/app/storereviewes/graphs', storereview.getreviewgraph);


};