//check .env file for the API key details

document.querySelector('input[name="depDate"]').valueAsDate = new Date();

/**
 * API requests for GeoName, WeatherBit and PixaBay
 */
// async function to get lat/long coords from Geoname API
export const geoNameDetails = async (city) => {
	const gnBaseURL = 'http://api.geonames.org/searchJSON?q=';
	const gnKey = process.env.GEONAMEKEY;

	const geoNameEndpoint = `${gnBaseURL}${city}&username=${gnKey}`;
	const response = await fetch(geoNameEndpoint);
	try {
		const geoData = await response.json();
		console.log(geoData, 'geo');
		return geoData;
	} catch (error) {
		console.log('error in geoNamedata');
	}
};

// async function to get image from PixaBay API
export const pixDetails = async (city) => {
	const pbBaseURL = 'https://pixabay.com/api/?key=';
	const pbkey = process.env.PIXAKEY;
	let pbEndpoint = `${pbBaseURL}${pbkey}&q=${city}&image_type=photo`;

	const response = await fetch(pbEndpoint);

	try {
		const pixData = await response.json();
		console.log(pixData, 'pixData');
		return pixData.hits[0].webformatURL;
	} catch (error) {
		console.log('error in pixa');
	}
};

//async function to fetch weather data from WeatherBit API
export const wbDetails = async (lat, lon) => {
	const wbBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
	const wbkey = process.env.WBKEY;
	let wbConfig = `${wbBaseURL}?key=${wbkey}`;
	let wbEndpoint = `${wbConfig}&lat=${lat}&lon=${lon}`;

	const response = await fetch(wbEndpoint);

	try {
		let result = [];
		const wbData = await response.json();
		result[0] = wbData.data[0].temp;
		result[1] = wbData.data[1].temp;
		result[2] = wbData.data[2].temp;
		result[3] = wbData.data[0].max_temp;
		result[4] = wbData.data[0].min_temp;
		result[5] = wbData.data[0].weather.description;

		// TODO: add weather icon

		/*console.log(wbData.data[0].weather.description, 'weather desc');
		console.log(wbData.data[0].weather.icon, 'weather icon');*/
		return result;
	} catch (error) {
		console.log('error in weatherbit');
	}
};

// submit action trigger this method
export const submitHandler = (e) => {
	e.preventDefault();
	const departureCity = document.querySelector('input[name="depFrom"]').value;
	const travellingTo = document.querySelector('input[name="arrTo"]').value;
	const departureDate = document.querySelector('input[name="depDate"]').value;

	geoNameDetails(travellingTo)
		.then(async (geoData) => {
			const lat = geoData.geonames[0].lat;
			const lon = geoData.geonames[0].lng;

			// fetch data from Geo and use it to make a call to WB and PixaBay
			const wbData = await wbDetails(lat, lon);
			const image = await pixDetails(travellingTo);
			return { wbData: wbData, image: image };
		})
		.then((fetchData) => {
			const postDataEndpoint = `${process.env.PORT}/sendAll`;
			//post data to server endpoint
			const returnData = postData(postDataEndpoint, {
				departureCity,
				travellingTo,
				departureDate,
				weather: `Day 1: ${fetchData.wbData[0]}&#8451 || Day 2: ${fetchData.wbData[1]}&#8451 || Day 3: ${fetchData.wbData[2]}&#8451 `,
				image: fetchData.image,
				maxTemp: fetchData.wbData[3],
				minTemp: fetchData.wbData[4],
				weatherDescription: fetchData.wbData[5],
			});
			return returnData;
		})

		//call update UI method with returned data
		.then((returnData) => {
			updateUI(returnData);
		});
};

// method to get the final user data, which will then be sent to server endpoint on submit
export const postData = async (url = '', data = {}) => {
	const res = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		body: JSON.stringify({
			departureFrom: data.departureCity,
			arrivingTo: data.travellingTo,
			departureDate: data.departureDate,
			weather: data.weather,
			image: data.image,
			maxTemp: data.maxTemp,
			minTemp: data.minTemp,
			weatherDescription: data.weatherDescription,
		}),
	});
	try {
		const returnData = await res.json();
		return returnData;
	} catch (error) {
		console.log('Error while posting', error);
	}
};

//Paint DOM with data from server
export const updateUI = async (returnData) => {
	try {
		document.querySelector(
			'#travellingTo'
		).innerHTML = `Travelling from: ${returnData.departureFrom}`;

		document.querySelector(
			'#arrivingat'
		).innerHTML = `Travelling to: ${returnData.arrivingTo}`;

		document.querySelector(
			'#depDate'
		).innerHTML = `Departure Date: ${returnData.departureDate}`;

		document.querySelector(
			'#maxTemp'
		).innerHTML = `Max Temp: ${returnData.maxTemp}`;

		document.querySelector(
			'#minTemp'
		).innerHTML = `Min Temp: ${returnData.minTemp}`;

		document.querySelector(
			'#forecast'
		).innerHTML = `3-day Weather forecast: ${returnData.weather}`;

		document.querySelector(
			'#weatherDescription'
		).innerHTML = `Weather description: ${returnData.weatherDescription}`;

		document.querySelector('#dataImage').setAttribute('src', returnData.image);
		daysDiff(returnData.departureDate);
	} catch (error) {
		console.log('updateUI error', error);
	}
};

//Helper utilities

// Mthod to find days until travel date
function daysDiff(departDate) {
	const newDate = new Date(departDate).getTime();
	const day = setInterval(function () {
		const curr = new Date().getTime();
		const diff = newDate - curr;

		// calculate days
		const calcDays = Math.floor(diff / (1000 * 60 * 60 * 24));

		// set value to DOM
		document.querySelector(
			'#remainingDiff'
		).innerHTML = ` Days remaining for your trip: ${calcDays} days `;

		// error handling
		if (diff < 0) {
			clearInterval(day);
			document.querySelector('#remainingDiff').innerHTML =
				'Error: You are past your departure date';
		}
	}, 1000);
}

const submitHandlerRoot = document.querySelector('#submit');
document.addEventListener('DOMContentLoaded', (_) => {
	submitHandlerRoot.addEventListener('click', submitHandler); // add submit handling to DOM
});

const print = document.querySelector('#save');
print.addEventListener('click', (e) => {
	window.print(); // enable print functionality
});

const startOver = document.querySelector('#startOver');
startOver.addEventListener('click', (e) => {
	window.location.reload(); // reset method
});
