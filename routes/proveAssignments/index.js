const routes = require('express').Router();

routes   
   .use('/02', require('./prove02')) 
   .use('/08', require('./prove08'))
   .use('/09', require('./prove09'))

module.exports = routes;