const routes = require('express').Router();
const teamActivities = require('./teamActivities');
const proveAssignments = require('./proveAssignments');
const beemazon = require('./Beemazon');
const errorController = require('../controllers/Beemazon/error')

routes
  .use('/teamActivities', teamActivities)
  .use('/proveAssignments', proveAssignments) 
  .use('/beemazon', beemazon) 
  .get('/500', errorController.get500)
  .get('/', (req, res, next) => {        
     res.render('pages/index', {title: 'Welcome to my CSE341 repo', path: '/'});
  })   
   .use(errorController.get404)
   .use((error, req, res, next) => {
      res.redirect('/500');
   });
  

  module.exports = routes;