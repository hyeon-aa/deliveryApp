module.exports = function(app) {
    const storereview = require('./storereviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //리뷰 등록
    app.post('/app/storereview',jwtMiddleware, storereview.poststorereview);

    //리뷰 수정
    app.patch('/app/storereviewes/:useridx',jwtMiddleware, storereview.patchstorereviewcontent);

    //리뷰 삭제
    app.patch('/app/storereviewes/:useridx/status',jwtMiddleware, storereview.patchstorereview);

    //*리뷰보드 조회
    app.get('/app/storereviewes/board', storereview.getreviewBoard);

    //*리뷰 댓글 수 조회
    app.get('/app/storereviewes/commentnum', storereview.getStorereviewcommentNum);

    //*리뷰 그래프
    app.get('/app/storereviewes/graph', storereview.getreviewgraph);


};