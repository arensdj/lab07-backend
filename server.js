'use strict';

// Application dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Load environment from .env file
require('dotenv').config();

// Instantiate an express object.  We now have access to all the express method (e.g. app.get, app.use, app.listen).
const app = express();

// Application setup
const PORT = process.env.PORT || 3000;

// This is middleware that gets permissions to allow client and server to communicate
app.use(cors());

// Route handlers
app.get('/location', searchToLatLong);
app.get('/weather', (searchToWeather));
app.get('/yelp', (searchToYelp));
app.get('/movies', (searchToMovies));

//test route
app.get('/testing', (request,response) => {
  console.log('Hit the /testing route!');
  let david = {firstName: 'David', lastName: 'Chambers', awesome: true};
  response.json(david);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*  Error handler functions
-------------------------------------------*/
function handleError(error, response) {
  console.error(error);
  if (response) response.status(500).send('Sorry, something went wrong!');
}

/*  Helper Functions
-------------------------------------------*/
function searchToLatLong(request, response){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url) 
    .then(apiResponse => {
      let location = new Location(request.query.data, apiResponse);
      response.send(location);
    })
    .catch(error => handleError(error, response));
}

function searchToMovies(request, response){
  // const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1`;

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.data.search_query}`;
  
  return superagent.get(url)
    .then(movieResponse => {
      // console.log('The movie response: ', movieResponse.body.results[0].title);
      const moviesReviews = movieResponse.body.results.map((movie) => {
        return new Movie(movie);
      });
      response.send(moviesReviews);
    })
    .catch(error => handleError(error,response));
}

function searchToWeather(request, response){
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  return superagent.get(url)
    .then(weatherResponse => {
      const weatherSummeries = weatherResponse.body.daily.data.map(day=> {
        return new Weather(day);
      });
      response.send(weatherSummeries);
    })
    .catch(error => handleError(error, response));
}

function searchToYelp(request, response){
  const url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${request.query.data.latitude}&longitude=${request.query.data.longitude}`;
  
  return superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(foodResponse => {
      const foodReviews = foodResponse.body.businesses.map((restaurant) => {
        return new Food(restaurant);
      });
      response.send(foodReviews);
    })
    .catch(error => handleError(error,response));
}

/*  Constructors
-------------------------------------------*/
function Food(yelpResult) {
  this.url = yelpResult.url;
  this.name = yelpResult.name;
  this.rating = yelpResult.rating;
  this.price = yelpResult.price;
  this.image_url = yelpResult.image_url;
}

function Movie(movieResult) {
  this.title = movieResult.title;
  this.released_on = movieResult.release_date;
  this.total_votes = movieResult.vote_count;
  this.title = movieResult.title;
  this.image_url = movieResult.poster_path ? `https://image.tmdb.org/t/p/w200${movieResult.poster_path}` : 'http://media.graytvinc.com/images/810*607/Movie32.jpg';
  this.overview = movieResult.overview;
}

function Location(query, apiResult) {
  this.search_query = query;
  this.formatted_query = apiResult.body.results[0].formatted_address;
  this.latitude = apiResult.body.results[0].geometry.location.lat;
  this.longitude = apiResult.body.results[0].geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
