'use strict';

// **** REQUIRE *** (lime import but for the backend)

const express = require('express');
const axios = require('axios');
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
app.get('/',(req, res, next) => {
    res.status(200).send('Welcome to my server!'); // this is what you are sending. You're sending the status of 200
});

// GOAL OF THIS IS TO RETURN CITY SEARCHED

const getWeather = require('./modules/weather')
app.get('/weather', getWeather);

const getMovie = require('./modules/movie')
app.get('/movie', getMovie);

// async function getMovie(req, res, next)  {
//     try{
//         //TODD: accept or define my queries -> /photos?searchQuery=VALUE.... searchQUERY = city in the example below.
//         let targetCity = req.query.cityName;
//         //TODO: build out my url for axios
//         let urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${targetCity}`;
//         //TODO: store axios data
//         let movieData = await axios.get(urlMovie);
//         //TODO: take that result from axios and groom down below after this function
//         let englishMovies  = movieData.data.results.filter(movie => movie.original_language === 'en' && movie.backdrop_path);
//         console.log(englishMovies);
//         let groomMovieData = englishMovies.map(movie => new MovieInfo(movie));
//         //TODO: groom data and send it to the response
//         // res.status(200).send(movieData.data);
//         res.status(200).send(groomMovieData);
//     }
//     catch(error){
//        next(error)
//     }   
// };


app.get('/test', async (req, res, next) => {
    try{
        res.status(200).send('this server is working... the issue is your API key');
    }
    catch(error){
       next(error)
    }   
});

//TODO: define my photo class and info I want to render to the 

// *** CLASS TO GROOM BUILKY DATA ***


class MovieInfo{
    constructor(movieObj){
        this.movieTitle = movieObj.original_title,
        this.movieReleaseDate = movieObj.release_date,
        this.movieDescription = movieObj.overview,
        this.movieImage = 'https://image.tmdb.org/t/p/w500' + movieObj.poster_path
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