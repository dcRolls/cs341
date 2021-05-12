// Our initial setup (package requires, port number setup)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://jefe:nD3VCmT5FxM8MQX0@cs341.ozi23.mongodb.net/Beemazon?retryWrites=true&w=majority'

const User = require('./models/Beemazon/user');
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();

const store = new MongoDBStore({
   uri: DB_URI,
   collection: 'sessions'
});

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

const csrfProtection = csrf();

app.use(
   session({
      resave: false,
      saveUninitialized: false,
      store: store
   })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
   if(!req.session.user) {
      return next();
   }
   user.findById(req.session.user._id)
       .then(user => {
          req.user = user;
          next();
       })
       .catch(err => console.log(err));
});

app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken = req.csrfToken();
});

app.use(express.static(path.join(__dirname, 'public')))   
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs') //this tells compiler to use ejs as the templating engine
   .use(bodyParser({extended: false})) // For parsing the body of a POST   
   .use('/', routes);
   
mongoose
   .connect(DB_URI, options)
   .then(result => {
      app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
   })
   .catch(err => {
      console.log("Failed to connect to DB", err);
   });