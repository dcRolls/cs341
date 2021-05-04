const Product = require('../../models/Beemazon/product');
const Category = require('../../models/Beemazon/category');
const errorHandler = require('./error');

exports.getProductList = (req, res, next) => {  
  const category = req.params.category;  
  Product.fetchAll(category, products => {
    res.render('Beemazon/pages/shop/product-list', {
      prods: products,
      pageTitle: category,
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {  
  const prodId = req.params.productId;    
  Product.findById(prodId, product => {
    if (product === undefined) {      
      errorHandler.get404(req, res, next);
    } else {
      res.render('Beemazon/pages/shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'            
      });
    }
  });
};

exports.getIndex = (req, res, next) => {  
  //get categories
  Category.fetchAll(categories => {
    //get products
    Product.fetchAll('', products => {
      //build categorized product list:
      const productList = categories.map(cat => {
        return {category: cat, products: products.filter(p => p.category === cat)}
      });
      res.render('Beemazon/pages/shop/index', {
        categories: categories,
        prods: productList,
        pageTitle: 'Shop',
        path: '/'
      });    
    });
  });
};


