'use strict';

const axios = require('axios');

async function getMovie(req,res,next){
    try{
        //TODD: accept or define my queries -> /photos?searchQuery=VALUE.... searchQUERY = city in the example below.
        let targetCity = req.query.cityName;
        //TODO: build out my url for axios
        let urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${targetCity}`;
        //TODO: store axios data
        let movieData = await axios.get(urlMovie);
        //TODO: take that result from axios and groom down below after this function
        let englishMovies  = movieData.data.results.filter(movie => movie.original_language === 'en' && movie.backdrop_path);
        console.log(englishMovies);
        let groomMovieData = englishMovies.map(movie => new MovieInfo(movie));
        //TODO: groom data and send it to the response
        // res.status(200).send(movieData.data);
        res.status(200).send(groomMovieData);
    }
    catch(error){
       next(error)
    }   
}

class MovieInfo{
    constructor(movieObj){
        this.movieTitle = movieObj.original_title,
        this.movieReleaseDate = movieObj.release_date,
        this.movieDescription = movieObj.overview,
        this.movieImage = 'https://image.tmdb.org/t/p/w500' + movieObj.poster_path
    };
}

module.exports = getMovie;