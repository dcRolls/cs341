const http = require('http');
const routes = require('./prove01-routes') //note the ./ indicates it's a custom local file

const server = http.createServer(routes.handler); // create a server

server.listen(3000); //start listening for requests; keeps running in a loop