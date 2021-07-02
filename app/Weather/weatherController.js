const axios = require("axios");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const {connect} = require("http2");

/*
exports.weather= async function (req, res) {

    axios({
        method:'get',
        url:   `http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?serviceKey=x2bXYHMeWutgCiIv7VKXZLAqluLh1OmRZLQTSr8EWz1df%2BfdJz7dri0V%2F2MV8sZ8hF0dNs%2BVDvUFIln2up4Arw%3D%3D&numOfRows=10&pageNo=1&base_date=20210618&base_time=0600&nx=55&ny=127`

})
        .then(function(response){
            console.log(response);
        })
};
*/
/*
exports.weather= async function (req, res) {
    try {
        const data12= await axios.get(
                `http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?serviceKey=x2bXYHMeWutgCiIv7VKXZLAqluLh1OmRZLQTSr8EWz1df%2BfdJz7dri0V%2F2MV8sZ8hF0dNs%2BVDvUFIln2up4Arw%3D%3D&numOfRows=10&pageNo=1&dataType=json&base_date=20210618&base_time=0600&nx=55&ny=127`
            )

        var plainData = data12.data.response.header;
        console.log(plainData);

        // consle.log(`data`, data)
        // consle.log(`data`, ${data})
        // console.log(JSON.stringify(data12.data.response.header));

        return response(baseResponse.SUCCESS, plainData);
    }  catch (err) {
        console.log(err);
    }
}
*/

exports.weather= async function (req, res) {
    try {

        const base_time = req.query.base_time;

        const data12= await axios.get(
            `http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?serviceKey=x2bXYHMeWutgCiIv7VKXZLAqluLh1OmRZLQTSr8EWz1df%2BfdJz7dri0V%2F2MV8sZ8hF0dNs%2BVDvUFIln2up4Arw%3D%3D&numOfRows=10&pageNo=1&dataType=json&base_date=20210630&base_time=${base_time}&nx=55&ny=127`
        )

        var plainData = data12.data.response.body;

        console.log(plainData);

        for (i in plainData['items']['item'])
        { console.log('코드 : ' + plainData['items']['item'][i]['category']);
            console.log('x좌표 : ' + plainData['items']['item'][i]['nx']);
            console.log( 'y좌표 : ' + plainData['items']['item'][i]['ny'] )};

        //console.log(JSON.stringify(data12.data.response.header));

        return res.send(response(baseResponse.SUCCESS, plainData));
    }  catch (err) {
        console.log(err);
    }
};

/*
exports.weather= async function (req, res) {
    try {
        const year = req.query.year;
        const data12= await axios.get(
            `http://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo?year=${year}&pageNo=1&numOfRows=100&returnType=json&serviceKey=x2bXYHMeWutgCiIv7VKXZLAqluLh1OmRZLQTSr8EWz1df%2BfdJz7dri0V%2F2MV8sZ8hF0dNs%2BVDvUFIln2up4Arw%3D%3D`
        )
        console.log(data12);
        var plainData = data12.data.response.body;
        console.log(plainData);

        return res.send(response(baseResponse.SUCCESS, plainData));

    }  catch (err) {
        console.log(err);
    }
}
*/

exports.myweather= async function (req, res) {
    try {
        const year = req.body.year;
        const pageNnum = req.body.pageNnum ;

        const data12= await axios.get(
            `http://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo?year=${year}&pageNo=${pageNnum}&numOfRows=100&returnType=json&serviceKey=x2bXYHMeWutgCiIv7VKXZLAqluLh1OmRZLQTSr8EWz1df%2BfdJz7dri0V%2F2MV8sZ8hF0dNs%2BVDvUFIln2up4Arw%3D%3D`
        )
        var plainData = data12.data.response.body;
        console.log(plainData);

        return res.send(response(baseResponse.SUCCESS, plainData));

    }  catch (err) {
        console.log(err);
    }
}














