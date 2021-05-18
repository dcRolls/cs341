const category = require('../../models/Beemazon/category');
const Category = require('../../models/Beemazon/category');
const Product = require('../../models/Beemazon/product');
const user = require('../../models/Beemazon/user');

exports.getAddProduct = (req, res, next) => {  
  res.render('Beemazon/pages/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false    
  });
};

exports.postAddProduct = (req, res, next) => {
  Category.addIfNew(req.body.category)
    .then(category => {
      const product = new Product({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        category: category._id,
        seller: req.session.user._id,
        options: {
          title: req.body.optionsTitle,
          list: req.body.options.split(',')
        }        
      });       
      product.save()
        .then(result => {
          res.redirect('/beemazon/admin/products')
        })         
    })
    .catch(err => console.log(err));    
};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .populate('category')
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }      
      res.render('Beemazon/pages/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product        
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => { 
  Category.addIfNew(req.body.category)
    .then(category => {
      Product.findById(req.body.productId)
        .then(product => {          
          product.title = req.body.title;
          product.price = req.body.price;
          product.description = req.body.description;
          product.imageUrl = req.body.imageUrl;
          product.category = category._id;
          product.seller = req.session.user._id;
          product.options = { 
            title: req.body.optionsTitle,
            list: req.body.options.split(',')
          };
          return product.save();
        })
        .then(result => {      
          res.redirect('/beemazon/admin/products');
        })        
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ seller: req.session.user._id })
    .then(products => {      
      res.render('Beemazon/pages/admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'        
      });
    })
    .catch(err => console.log(err));  
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {      
      res.redirect('/beemazon/admin/products');
    })
    .catch(err => console.log(err));
};
