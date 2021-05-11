// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const User = require('./models/Beemazon/user');
const DB_URI = 'mongodb+srv://jefe:nD3VCmT5FxM8MQX0@cs341.ozi23.mongodb.net/Beemazon?retryWrites=true&w=majority'
const app = express();

const routes = require('./routes'); //by not listing a specific file in routes, it will use index.js by default

app.use(express.static(path.join(__dirname, 'public')))   
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs') //this tells compiler to use ejs as the templating engine
   .use(bodyParser({extended: false})) // For parsing the body of a POST
   .use((req, res, next) => { 
      User.findById('609610d6dc56d22f90145efb')
      .then(user => {        
          req.user = user;                 
          next();
      })
      .catch(err => console.log(err));    
   })
   .use('/', routes);

mongoose
   .connect(DB_URI)
   .then(result => {
      app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
   })
   .catch(err => {
      console.log(err);
   });