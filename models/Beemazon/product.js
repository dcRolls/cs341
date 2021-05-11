const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { 
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  imageUrl: {
    type: String,
    required: true
  },
  options: {
    title: String,
    list: [String],
    required: false
  }
});

//you can add functions to the mongoose object like this:
productSchema.statics.findByCategory = function(searchCategory) {
  const query = { category: searchCategory };  
  return this.find(query);    
};

//mongoose takes 'Product, makes it lower case and plural, and creates
//a table using that modified name.
module.exports = mongoose.model('Product', productSchema);


//to reference another table:
//userId: {
//  type: Schema.Types.ObjectId,
//  ref: 'User //this is the model name you assigned (like 'Product' above)
//}

//to include the full linked object data in a fetch:
//Product.find().populate('userId') //this tells mongoose to populate the user id field with the full user data

//to control which fields are returned:
//.select(title price -_id) //this includes title and price, but excludes _id

