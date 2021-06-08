const MyData = require('../../models/proveAssignments/prove08');

const PAGE_SIZE = 10;

exports.getPage = (req, res, next) => {  
  res.render('pages/proveAssignments/prove08', {
    title: 'Prove 08 - Pagination',
    path: 'proveAssignments/08',
    baseUrl: '/proveAssignments/08/products',
    model: 'prove08'
  });
}

exports.getProducts = async (req, res, next) => {      
  try {    
    const page = Math.max(parseInt(req.query.page), 1);
    const dataSet = new MyData();
    const skip = (page - 1) * PAGE_SIZE;
    const data = await dataSet.getProducts(PAGE_SIZE, skip);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const pages = Math.ceil(dataSet.getProductCount() / PAGE_SIZE);
    
    return res.status(200).json({
      pageCount: pages, 
      page: page,
      items: data      
    });  
  }
  catch {
    return res.status(500).json('[]');
  }
};


