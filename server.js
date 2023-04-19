'use strict';

// **** REQUIRE *** (lime import but for the backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let weatherData = require('./data/weather.json');

// *** app === server - Need to call Express to create the server
// reference the server 'app' as your code
const app = express();

// *** MIDDLEWARE *** allow anyone to hit our server
//kinda like the body guard
app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Port ${PORT} is up and running`);
});

// **** ENDPOINT ****
// *** 1st arg - endpoint url
// *** 2nd arg - callback which will execute when that endpoint is hit
//           *** 2 parameters: request req, response res
app.get('/',(req, res) => {
    res.status(200).send('Welcome to my server!'); // this is what you are sending. You're sending the status of 200
});

app.get('/hello', (req, res) => {
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    console.log(req.query);
    res.status(200).send(`Hello, ${firstName} ${lastName} welcome to my server!`)
})


// GOAL OF THIS IS TO RETURN CITY SEARCHED

app.get('/weather', (req, res, next) => {
    try{
        let queriedSpecies = req.query.cityName;

        let cityDataArr = weatherData.find(city => city.city_name.toLocaleLowerCase() === queriedSpecies.toLocaleLowerCase()); //this line searches the big json and returns a smaller but bulky array
        let dataToSend = cityDataArr.data.map(cityDataObj =>  new WeatherInfo(cityDataObj)); // this line is to trim down the bulkiness
        res.status(200).send(dataToSend);
    }
    catch(error){
       next(error)
    }   
});


// *** CLASS TO GROOM BUILKY DATA ***
class WeatherInfo{
    constructor(cityObj){
        this.weatherDescription = cityObj.weather.description,
        this.weatherDate = cityObj.valid_date
    };
}



// app.get ('/search', (request, response) =>{
//     let userAPIKey = request.query.key;
//     let locationQuery = request.query.q;
//     console.log(request.query);
//     response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server!`);
//     })

// ORDER of this '*' query must be last because it will run if above. This is catch all.
app.get('*', (req, res) => {
    res.status(404).send('This page does not exist');
});


// *** ERROR HANDLING FOR BACK END ERRORS FROM CLIENT REQUESTS
app.use((error, request, response, next) => {
    console.log(error.message);
    response.status(500).send(error.message);
})