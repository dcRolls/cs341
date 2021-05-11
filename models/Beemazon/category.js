const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: { 
    type: String,
    required: true
  }  
});

categorySchema.statics.addIfNew = function(category) {
  const query = { title: category };
  const update = { expire: new Date() };
  const options = { upsert: true, new: true, setDefaultsonInsert: true };
  return this.findOneAndUpdate(query, update, options);    
};

module.exports = mongoose.model('Category', categorySchema);