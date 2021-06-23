const express = require('express');
const router = express.Router();
const io = require('../../socket');

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../../data/ta10-data.json')

router.get('/', (req, res, next) => {    
  res.render('pages/proveAssignments/prove11', {
      title: 'Prove Activity 11',
      path: '/proveAssignments/11',
  });
});

router.get('/fetchAll', (req, res, next) => {
    res.json(dummyData);
});

router.post('/insert', (req, res, next) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.body.name) {  
    if(dummyData.avengers.findIndex(x => x.name === req.body.name) < 0) {
      let hero = {
        name: req.body.name,
        identity: req.body.identity,
        powers: req.body.powers        
      };
      dummyData.avengers.push(hero);        
    }    
    res.status(200).json(dummyData);
  } else {    
    res.status(400).json(dummyData);
  }
});

module.exports = router;