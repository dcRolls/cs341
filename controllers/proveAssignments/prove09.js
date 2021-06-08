const PokeData = require('../../models/proveAssignments/prove09');

const PAGE_SIZE = 10;

exports.getPage = (req, res, next) => {  
  res.render('pages/proveAssignments/prove08', {
    title: 'Prove 09 - Pagination II',
    path: 'proveAssignments/09',
    baseUrl: '/proveAssignments/09/pokemon',
    model: 'prove09'
  });
}

exports.getPokemon = async (req, res, next) => {      
  try {        
    const page = req.query.page || 1;    
    const skip = (page - 1) * PAGE_SIZE;    
    const result = await PokeData.getPokemon(skip, PAGE_SIZE);    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');    
    return res.status(200).json({ 
      items: result.results, 
      page: page, 
      pageCount: Math.ceil(result.count / PAGE_SIZE)
    });  
  }
  catch {
    return res.status(500).json('[]');
  }
};


