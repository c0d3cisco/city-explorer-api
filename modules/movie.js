'use strict';

const axios = require('axios');

let cache = {};

// TODO: create a key for each query
// TODO: if the results exist AND the are with a a valid time frame .. send that data from the cach
// TODO: if the results don't exist, hit APU, then add that to the catch.


async function getMovie(req,res,next){
    try{
        //TODD: accept or define my queries -> /photos?searchQuery=VALUE.... searchQUERY = city in the example below.
        // console.log(req.query.cityName);
        let targetCity = req.query.cityName;
        let keyMovie = `${targetCity}-movies`;
        // console.log('18 - ', cache[keyMovie]);
        
        if(cache[keyMovie] && (Date.now() - cache[keyMovie].timeStamp) < 172800000) {
            console.log('cache was hit!', cache[keyMovie]);
            res.status(200).send(cache[keyMovie].data);
        } else {
            console.log('cache was missed');
            //TODO: build out my url for axios
            let urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${targetCity}`;
            //TODO: store axios data
            let movieData = await axios.get(urlMovie);
            //TODO: take that result from axios and groom down below after this function
            let englishMovies  = movieData.data.results.filter(movie => movie.original_language === 'en' && movie.backdrop_path);
            // console.log(englishMovies);
            let groomMovieData = englishMovies.map(movie => new MovieInfo(movie));
            //TODO: groom data and send it to the response
            // console.log(groomMovieData);
            cache[keyMovie] = {
                data: groomMovieData,
                timeStamp: Date.now()
            }
            // res.status(200).send(movieData.data);
            console.log('cache was saved!', cache[keyMovie]);
            res.status(200).send(groomMovieData);
        }
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