const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect("mongodb+srv://jefe:nD3VCmT5FxM8MQX0@cs341.ozi23.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(client => {
    console.log("Connected!");
    _db = client.db(); //enter db name here to connect to a different db than the default (myFirstDatabase)
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

const getDb = () => {
  if(_db) {
    return _db;
  }
  throw "No database found.";
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
