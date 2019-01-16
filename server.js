'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/location', searchToLatLong);
app.get('/weather', (searchToWeather));
app.get('/yelp', (searchToYelp));

//test route
app.get('/testing', (request,response) => {
  console.log('Hit the /testing route!');

  let david = {firstName: 'David', lastName: 'Chambers', awesome: true};
  response.json(david);

});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Error handler functions
function handleError(error, response) {
  console.error(error);
  if (response) response.status(500).send('Sorry, something went wrong!');
}

//Helper Functions
function searchToLatLong(request, response){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;
  return superagent.get(url) 
    .then(apiResponse => {
      let location = new Location(request.query.data, apiResponse);
      response.send(location);
    })
    .catch(error => handleError(error, response));
}
function Food(query,)


function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function Location(query, apiResult) {
  this.search_query = query;
  this.formatted_query = apiResult.body.results[0].formatted_address;
  this.latitude = apiResult.body.results[0].geometry.location.lat;
  this.longitude = apiResult.body.results[0].geometry.location.lng;
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
  const url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${req.query.data.latitude}&longitude=${req.query.data.longitude}`;
  return superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(foodResponse =>{
      const foodReviews = foodResponse.body.businesses.map((restaurant) => {
        return new Food(restaurant);
      });
      response.send(foodReviews);
    })
    .catch(error => handleError(error,response));
}


