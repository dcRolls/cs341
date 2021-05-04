const express = require('express');
const fs = require('fs');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.render('pages/proveAssignments/prove02', { 
    title: 'Prove 02 - Add a Book',     
    path: 'proveAssignments/02', // For pug, EJS     
    contentCSS: true, // For HBS
  });
});

router.get('/booklist', (reg, res, next) => {
  const booklist = getBooks();
  renderbookList(res, booklist);
});

router.post('/booklist', (req, res, next) => {
  const bookdata = req.body;    
  const booklist = getBooks();  
  booklist.push(bookdata);
  fs.writeFile('booklist.json', JSON.stringify(booklist), (err) => {
    if(err)
      console.log(err);
    else 
      renderbookList(res, booklist);
  });
});

function getBooks() {
  let booklist = [];
  data = fs.readFileSync('booklist.json');   
  if(data.toString() !== '')
    booklist = JSON.parse(data);  
  
  return booklist;
}

function renderbookList(res, booklist) {
  res.render('pages/proveAssignments/prove02-result', { 
    title: 'Prove 02 - Booklist', 
    path: 'proveAssignments/02/booklist', // For pug, EJS 
    books: booklist,    
    contentCSS: true // For HBS    
  });
}

module.exports = router;