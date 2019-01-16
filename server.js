'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

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

//Helper Functions
function searchToLatLong(query){
  const geoData = require('./lab/darksky.json');
  const location = new Location(geoData);
  location.search_query = query;
  console.log(location);
  return location;
}

function Location(data) {
  //this.formatted_query = data.results[0].formatted_address;
  this.latitude = Object.values(data)[0];
  this.longitude = Object.values(data)[1];
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

