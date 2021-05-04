//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const router = express.Router();

const usernames = [];

router.get('/',(req, res, next) => {
    renderTa02(res);
});

router.post('/addUser', (req, res, next) => {
    const index = usernames.indexOf(req.body.username);
    let message = '';
    if (index > -1) {
        message = "Duplicate User!"
    }
    else {
        usernames.push(req.body.username);
    }
    renderTa02(res, message);
});

router.post('/removeUser', (req, res, next) => {
    const index = usernames.indexOf(req.body.username);
    let message = '';
    if (index > -1) {
        usernames.splice(index, 1);
    }
    else {
        message = "User does not exist!";
    }
    renderTa02(res, message);
});

function renderTa02(res, message = '') {
    res.render('pages/ta02', { 
        title: 'Team Activity 02',
        names: usernames, 
        errorMessage: message,
        path: 'teamActivities/02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
    });
}

module.exports = router;