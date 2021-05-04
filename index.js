// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const app = express();

const routes = require('./routes'); //by not listing a specific file in routes, it will use index.js by default

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs') //this tells compiler to use ejs as the templating engine
   .use(bodyParser({extended: false})) // For parsing the body of a POST
   .use('/', routes)
   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
