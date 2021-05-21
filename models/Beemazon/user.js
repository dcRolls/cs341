const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { 
    type: String,
    required: true
  },  
  address: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true    
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiry: Date,
  cart: {
    items: [
      {
        product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, 
        quantity: { type: Number, required: true }
      }]
  }
});

userSchema.methods.addToCart = function(product) {
  const pIdx = this.cart.items.findIndex(p => {
    return p.product.toString() === product._id.toString();
  });    
  if(pIdx >= 0) {
    this.cart.items[pIdx].quantity += 1;    
  } else {
    this.cart.items.push({ 
      product: product._id, 
      quantity: 1
    });
  }
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart= { items: [] };
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  const newCartItems = this.cart.items.filter(p => {
    return p.product.toString() !== productId.toString();
  });    
  this.cart.items = newCartItems;
  return this.save();
};

userSchema.methods.updateCartItem = function(productId, quantity) {
  const pIdx = this.cart.items.findIndex(p => {
    return p.product.toString() === productId.toString();
  });    
  if(pIdx >= 0) {
    this.cart.items[pIdx].quantity = quantity;    
  } 
  return this.save();
};


module.exports = mongoose.model('User', userSchema);

