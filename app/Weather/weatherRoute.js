module.exports = function(app){
    const weather = require('./weatherController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

  app.get('/app/weather', weather.weather);
  app.post('/app/myweather', weather.myweather);
};
