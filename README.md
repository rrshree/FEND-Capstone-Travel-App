### Project

Final capstone prject in Udacity - This app is a travel scheduler that can recieve date, desired destination and departure location, and display information like when the user is travelling, destination, departure, days remaining till travel date, 3 day destination weather forecast, max temp, min temp and weather description. User will also be able to see an image of the destination.

# External APIs used

- <a target="_blank" href="http://www.geonames.org/export/web-services.html">Geonames</a>
- <a target="_blank" href="https://www.weatherbit.io/account/create">Weatherbit</a>
- <a target="_blank" href="https://pixabay.com/api/docs/">Pixabay</a>

## Getting Started

1. Set `env` variables in a `.env` file. Your API keys are stored here

Install dependencies

```
npm install
```

2. Start the server

```
npm start
```

3. Setup the environment development or production

```
npm run build-dev
```

or

```
npm run build-prod
```

### Plans for future:

- Cover local storage usecases - add trips, delete trips
- Mutiple search requests
- Refactor for better chunk sizes
