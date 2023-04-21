'use strict';

const axios = require('axios');

async function getWeather(req,res,next){
    try{
        let lat = req.query.lat;
        let lon = req.query.lon;
        console.log(lat,lon);
        let urlWeather = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
        //TODO: store axios data
        let weatherData = await axios.get(urlWeather);
        // console.log(weatherData.data);
        //TODO: take that result from axious and groom down below after this function
        let dataToSend = weatherData.data.data.map(cityDataObj =>  new WeatherInfo(cityDataObj));
        // dataToSend.push(weatherData.data.city_name);
        console.log(dataToSend)
        //TODO: groom data and send it to the response
        // if its too big, it will say it is circular in nature
        res.status(200).send(dataToSend);
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