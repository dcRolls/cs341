const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  "Beemazon",
  'categories.json'
);

const getCategoriesFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {     
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Category {
  constructor(title) {    
    this.title = title;    
  }
  
  static fetchAll(cb) {
    getCategoriesFromFile(cb);
  }
};
