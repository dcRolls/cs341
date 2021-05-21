exports.get404 = (req, res, next) => {  
  res.status(404).render('Beemazon/pages/404.ejs', {
    pageTitle: "Huh...we can't find that page.", 
    path: '/404'   
  });
};

exports.get500 = (req, res, next) => {  
  res.status(500).render('Beemazon/pages/500.ejs', {
    pageTitle: "Whoops...this is awkward.", 
    path: '/500'    
  });
};