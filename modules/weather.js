'use strict';

const axios = require('axios');

let cache = {};
console.log(cache);

async function getWeather(req,res,next){
    try{
        let lat = req.query.lat;
        let lon = req.query.lon;
        let keyCoor = `${lat, lon}-weather`
        // console.log(lat,lon);
        if(cache[keyCoor] && (Date.now() - cache[keyCoor].timeStamp) < 43200000){
            console.log('cache was hit!', cache[keyCoor]);
            res.status(200).send(cache[keyCoor].data);
        } else {

            console.log('cache was missed');
        let urlWeather = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
        //TODO: store axios data
        let weatherData = await axios.get(urlWeather);
        // console.log(weatherData.data);
        //TODO: take that result from axious and groom down below after this function
        let dataToSend = weatherData.data.data.map(cityDataObj =>  new WeatherInfo(cityDataObj));
        // dataToSend.push(weatherData.data.city_name);
        // console.log(dataToSend)
        //TODO: groom data and send it to the response
        // if its too big, it will say it is circular in nature
        cache[keyCoor] = {
            data: dataToSend,
            timeStamp: Date.now()
        }
        console.log('cache was saved!', cache[keyCoor]);
        res.status(200).send(dataToSend);
        }
    }
    catch(error){
       next(error)
    }   
}

class WeatherInfo{
    constructor(cityObj){
        this.weatherDescription = cityObj.weather.description,
        this.weatherDate = cityObj.valid_date
    };
}

module.exports = getWeather;