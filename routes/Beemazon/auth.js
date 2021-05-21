const express = require('express');
const authController = require('../../controllers/Beemazon/auth');
const router = express.Router();
const User = require('../../models/Beemazon/user');
const { check, body } = require('express-validator/check');

router.get('/login', authController.getLogin);

router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()  
  ],
authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
  [
    body('name')
      .isLength( {min: 5})
      .withMessage('Your name appears to be too short.')
      .contains(' ')
      .withMessage('A valid first and last name are required'),      
    body('email')      
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .custom((value, { req }) => {        
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('An account with this email already exists.');
            }
          });
      }),
    body('password')
      .isLength({min: 7})
      .withMessage('Password must be at least 7 characters'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match.')
        }
        return true;
      })
  ],
  authController.postSignup
  );

router.get('/reset', authController.getReset);

router.post('/reset', 
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()  
  ],
  authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password',
  [
    body('password')
    .isLength({min: 7})
    .withMessage('Password must be at least 7 characters'),
  ],
  authController.postNewPassword);

module.exports = router;
