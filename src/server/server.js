var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));

//Get route
app.get('/', function (req, res) {
	res.sendFile('dist/index.html');
});

// Post Route
app.post('/sendAll', function (req, res) {
	let projectData = {};
	projectData.departureFrom = req.body.departureFrom;
	projectData.arrivingTo = req.body.arrivingTo;
	projectData.departureDate = req.body.departureDate;
	projectData.weather = req.body.weather;
	projectData.image = req.body.image;
	projectData.maxTemp = req.body.maxTemp;
	projectData.minTemp = req.body.minTemp;
	projectData.weatherDescription = req.body.weatherDescription;
	res.send(projectData);
});

// Setup Server
const port = 8111;
const server = app.listen(port, listening);

function listening() {
	console.log(`running on localhost: ${port}`);
}
