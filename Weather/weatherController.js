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
    const fs = require('fs');

    const aaa = () => {
        setTimeout( () => { console.log('d'); }, 0);
        console.log('c');
    };

    setTimeout( () => {
        fs.readFile('any.txt', () => {
            setTimeout(() => {
                console.log('e');
            }, 0);
            setImmediate(() => {
                console.log('f');
            });
        });
    }, 0);

    setTimeout( () => { console.log('a'); aaa(); }, 0 );

    Promise.resolve().then( () => { aaa(); console.log('b'); });


}

/*
exports.weather= async function (req, res) {
    try {
        const data= await axios.get(
            `http://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo?year=2020&pageNo=1&numOfRows=100&returnType=json&serviceKey=x2bXYHMeWutgCiIv7VKXZLAqluLh1OmRZLQTSr8EWz1df%2BfdJz7dri0V%2F2MV8sZ8hF0dNs%2BVDvUFIln2up4Arw%3D%3D`
        )
        console.log(data);
        console.log(`data:${data}`);
      //  for(output in data){
      // console.log(JSON.stringify(output))};

    }  catch (err) {
        console.log(err);
    }
}
*/














