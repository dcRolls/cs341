// Our initial setup (package requires, port number setup)
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/Beemazon/user');
const Category = require('./models/Beemazon/category');
const csrf = require('csurf');
const flash = require('connect-flash');

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://jefe:nD3VCmT5FxM8MQX0@cs341.ozi23.mongodb.net/Beemazon?retryWrites=true&w=majority'

const app = express();
const store = new MongoDBStore({
   uri: DB_URI,
   collection: 'sessions'
});

const csrfProtection = csrf();

const corsOptions = {
   origin: "https://prove02-jr.herokuapp.com/",
   optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   family: 4
};

const routes = require('./routes'); //by not listing a specific file in routes, it will use index.js by default

app.use(express.static(path.join(__dirname, 'public')))   
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs') //this tells compiler to use ejs as the templating engine
   .use(bodyParser({extended: false})) // For parsing the body of a POST   
   .use(bodyParser.json())
   .use(
      session({
         secret: 'my secret',
         resave: false,
         saveUninitialized: false,
         store: store
      })
   )
   .use(csrfProtection)
   .use(flash());   
   
   app.use((req, res, next) => {
      if(!req.session.user) {         
         return next();
      }
      User.findById(req.session.user._id)
          .then(user => {    
             if (!user) {
                return next();
             }        
             req.user = user;
             next();
          })
          .catch(err => {
           throw new Error(err);  
          });
   });

   app.use((req, res, next) => {      
      res.locals.isAuthenticated = req.session.isLoggedIn;   
      res.locals.csrfToken = req.csrfToken();
      res.locals.userName = req.session.user ? req.session.user.name : null;
      Category
         .find()
         .then(result => {
            res.locals.categories = result;            
            next();
         });               
   });

   app.use('/', routes);

mongoose
   .connect(DB_URI, options)
   .then(result => {
      app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
   })
   .catch(err => {
      console.log("Failed to connect to DB", err);
   });