const express = require('express');
const app = express();
const port = 9000;

// serve static files in www/
app.use(express.static('www'));

app.use(express.urlencoded({extended: false}));

// GET parameters
app.get('/get_params', (request, response) => {
	console.log(`Parameters: ${request.query['firstname']}`);
	response.send('HOME PAGE');
});

// POST parameters
app.post('/post_params', (request, response) => {
	console.log(`Parameters: ${request.body['email']}`);
	response.send(`Hello, ${request.body['email']}!`);
});

// route parameters
app.get('/route_params/:category/:id', (request, response) => {
	console.log(`Category: ${request.params['category']}`);
	console.log(`Id: ${request.params['id']}`);
	response.send(`Hello, ${request.params['category']}!`);
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
