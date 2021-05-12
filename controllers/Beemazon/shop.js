const Product = require('../../models/Beemazon/product');
const Category = require('../../models/Beemazon/category');
const Order = require('../../models/Beemazon/order');
const errorHandler = require('./error');


exports.getProductList = (req, res, next) => {  
  Category.findById(req.params.category)
    .then(category => {
      Product.find( {category: req.params.category })  
        .then(products => {          
          res.render('Beemazon/pages/shop/product-list', {
            prods: products,
            pageTitle: category.title,
            path: '/products'            
          });
        })        
    })
    .catch(err => console.log(err));  
};

exports.getProduct = (req, res, next) => {  
  const prodId = req.params.productId;    
  Product.findById(prodId)
    .then(product => {      
      res.render('Beemazon/pages/shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'                 
      });
    })
    .catch(err => console.log(err));      
};

exports.getIndex = (req, res, next) => {  
  //get hard-coded user first thing
  // const user = new User({
  //   name: 'Test User',
  //   email: 'test@test.com',
  //   address: 'test addres, test city',
  //   cart: {items: []}
  // });
  // user.save();
  //get categories  
  Category.find()
      .then(categories => {
        Product.find()
          .then(products => {          
            //build categorized product list:          
              const productList = categories.map(cat => {              
                return {category: cat, products: products.filter((p) => p.category._id.toString() === cat._id.toString())}
              });              
              res.render('Beemazon/pages/shop/index', {
                categories: categories,
                prods: productList,
                pageTitle: 'Shop',
                path: '/'                
              });    
          })                    
      })
    .catch(err => console.log(err));  
};

exports.getCart = (req, res, nect) => {
  req.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      res.render('Beemazon/pages/shop/cart', {
        path: '/cart',
        pageTitle: 'Cart',
        products: user.cart.items        
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {  
  Product.findById(req.body.productId)
    .then(product => {      
      return req.user.addToCart(product)
    })
    .then(result => {      
      res.redirect('/beemazon/shop/cart');
    })
    .catch(err => console.log(err));  
};

exports.postCartDeleteProduct = (req, res, next) => {
  req.user.deleteItemFromCart(req.body.productId)
    .then(result => {
      res.redirect('/beemazon/shop/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {  
  req.user.populate('cart.items.product')
  .execPopulate()
  .then(user => {    
    const products = user.cart.items.map(x => {
      return { quantity: x.quantity, item: { ...x.product._doc } };
    });
    const order = new Order({
      customer: {
        name: req.user.name,
        userId: req.user._id
      },
      products: products
    });    
    return order.save();    
  })
  .then(result => {
    return req.user.clearCart();    
  })
  .then(result => {
    res.redirect('/beemazon/shop/orders');
  })
  .catch(err => console.log(err));
};
  
exports.getOrders = (req, res, next) => {
  Order.find({ 'customer.userId': req.user._id })  
    .then(orders => {        
      res.render('Beemazon/pages/shop/orders', {
        path: '/orders',
        pageTitle: 'Recent Orders',
        orders: orders        
      });
    })
    .catch(err => console.log(err));
};

exports.postCartUpdateQty = (req, res, next) => {  
  if (parseInt(req.body.quantity) === 0) {
    this.postCartDeleteProduct(req, res, next);
  } else {
    req.user.updateCartItem(req.body.productId, req.body.quantity)
      .then(result => {
        res.redirect('/beemazon/shop/cart')
      })
      .catch(err => console.log(err));
  }
};