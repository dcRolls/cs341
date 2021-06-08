const fetch = require('node-fetch');
const URL = "https://byui-cse.github.io/cse341-course/lesson03/items.json";

module.exports = class MyData {
  constructor() { 
    let data = [];    
  }

  getProducts(limit, skip) {    
    return fetch(URL, { method: "Get" })
    .then(res => res.json())
    .then(items => {  
      this.data = items;        
      return this.data.slice(skip, skip + limit);
    }); 
  }

  getProductCount() {
    return this.data.length;
  }
};

