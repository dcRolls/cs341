const routes = require('express').Router();

routes   
   .use('/02', require('./prove02')) 
   

module.exports = routes;