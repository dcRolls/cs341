const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('pages/prove02', { 
    title: 'Prove 02', 
    path: '/prove02', // For pug, EJS     
    contentCSS: true, // For HBS
  });
});

router.post('/result', (req, res, next) => {
  const data = req.body;  
  res.render('pages/prove02-result', { 
    title: 'Prove 02 Results', 
    path: '/prove02-result', // For pug, EJS 
    name: `${data.name}`,
    phone: `${data.phone}`,
    card: `${data.card}`,    
    contentCSS: true, // For HBS
  });;  
});

module.exports = router;