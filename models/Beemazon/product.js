const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

module.exports = class Product {
  constructor(title, category, imageUrl, description, options, price, id) {    
    this.title = title;
    this.category = category;
    this.imageUrl = imageUrl;
    this.description = description;
    this.options = options;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;    
  }
  
  save() {    
    const db = getDb();
    let dbop;
    if(this._id) {
      dbop = db.collection('products').updateOne({_id: this._id}, {$set: this});
    } else {
      dbop = db.collection('products').insertOne(this);
    }
    return dbop
      .then(result => {
        console.log(result);
      })
      .catch( err => {
        console.log(err);
      });    
  }

  static fetchAll(category) {
    const db = getDb();
    const filter = (category !== undefined && category !== "") ? {category: category} : '';
    return db
      .collection('products')
      .find(filter)
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  static findById(id) {
    getProductsFromFile("", products => {
      const db = getdb();
      return db
        .collection('products')
        .find({_id: new mongodb.ObjectID(id)})
        .next()
        .then(product => {
          return product;
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  static deleteById(id) {
    const db = getDb();
    db.collection('products')
      .deleteOne({_id: new mongodb.ObjectId(id)})
      .then(() => {})
      .catch(err => console.log(err));
  }
};
