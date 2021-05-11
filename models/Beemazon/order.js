const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{ 
    item: { type: Object, required: true },
    quantity: {type: Number, required: true }
  }],  
  customer: {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
  }
});

module.exports = mongoose.model('Order', orderSchema);

