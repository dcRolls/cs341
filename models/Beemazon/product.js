const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  "Beemazon",
  'products.json'
);

const getProductsFromFile = (category, cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      let products = JSON.parse(fileContent.toString());
      if (category !== undefined && category !== '') {
        products = products.filter(p => p.category === category)
      }
      cb(products);
    }
  });
};

module.exports = class Product {
  constructor(id, title, category, imageUrl, description, options, price) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.imageUrl = imageUrl;
    this.description = description;
    this.options = options;
    this.price = price;
  }
  
  static fetchAll(category, cb) {
    getProductsFromFile(category, cb);
  }

  static findById(id, cb) {
    getProductsFromFile("", products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
