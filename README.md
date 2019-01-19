# lab-07
# City Explorer

**Author**: Tim Schoen and Jasmin Arensdorf
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
This is a backend server app that retrieves information about a city. It returns map data, weather forecasts, nearby restaurants, and movies set in the given city.

## Getting Started
After the repo is cloned, run 'npm i' in your console to install the dependencies. Create an .env file containing the PORT number and your own API keys.  Below is an example:

PORT=3000
GEOCODE_API_KEY=[api_key]
WEATHER_API_KEY=[api_key]
YELP_API_KEY=[api_key]
MOVIE_API_KEY=[api_key]

## Architecture
This application contains four dependencies:  express, cors, superagent, and dotenv.  On the client side the user invokes the app by entering a city.  The app reads this query parameter and uses a superagent 'get()' call to retrieve data from various APIs.  This data is parsed into an object and returned to the client. 

## Change Log
01-16-2019 9:00am - Refactored app to include functionality for /location and /weather.
01-16-2019 12:30pm - Added API functionality for /yelp restaurants
01-16-2019 1:45pm - Added API funcitonality for /movies
01-19-2919 8:45am - Fixed movie constructor to display movie image url.  Fixed movie url to query movies field at location

## Credits and Collaborations
Code that was refactored today was a collaboration between Tim Schoen and Jasmin Arensdorf.

Number and name of feature: Refactoring of /location and /weather
> Estimate of time needed to complete: 1:00
> Start time: 9:00
> Finish time: 10:00
> Actual time needed to complete: 1:00

> Number and name of feature: Yelp API
> Estimate of time needed to complete: 1:00
> Start time: 10:00
> Finish time: 11:30
> Actual time needed to complete: 1:30

> Number and name of feature: Movies API
> Estimate of time needed to complete: 1:00
> Start time: 11:30
> Finish time: 1:55
> Actual time needed to complete: 2:25

Number and name of feature: Deployment of City Explorer
> Estimate of time needed to complete: 5 min
> Start time: 1:30
> Finish time: 1:45
> Actual time needed to complete: 15 min

Number and name of feature: Movie Constructor
> Estimate of time needed to complete: 1:00
> Start time: 9:30
> Finish time: 11:00
> Actual time needed to complete: 2:00