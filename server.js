'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/location', searchToLatLong);

app.get('/weather', (request, response) => {
  const weatherData = searchToWeather(request.query.data);
  // Entire array of weather data being sent back to client the front-end.
  response.send(weatherData);
});

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

function Location(query, apiResult) {
  this.search_query = query;
  this.formatted_query = apiResult.body.results[0].formatted_address;
  
  this.latitude = apiResult.body.results[0].geometry.location.lat;
  this.longitude = apiResult.body.results[0].geometry.location.lng;
}

function searchToWeather(query){
  const darkskyData = require('./lab/darksky.json');
  const weatherArray = [];

  // 
  darkskyData.daily.data.forEach(day => {
    // Instances of Weather object is pushed into array.
    weatherArray.push(new Weather(day));
  })
  return weatherArray;
}

function Weather(day) {
  this.forecast = day.summary;
  // The utc time is in seconds. Need to convert to milli seconds
  // It is being stringified so you have a date format (e.g. Jan 15, 2019)
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

