const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/Beemazon/user');
const creds = process.env.ROOTURL ? null : require('../../data/email');
const nodemailer = require('nodemailer');
const EMAILURL = process.env.ROOTURL || "http://localhost:5000";
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT || creds.EMAIL_ACCOUNT, 
    pass: process.env.EMAIL_PWD || creds.EMAIL_PWD
  }
});

function getErrorMessage(flash) {  
  return flash.length > 0 ? flash[0] : null;
}

function renderLogin(res, email, password, errors) {
  return res
    .status(422)
    .render('Beemazon/pages/auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors,
      oldInput: { 
        email: email, 
        password: password 
      }
    });
}

exports.getLogin = (req, res, next) => {       
  return renderLogin(res, '', '', []); 
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {   
    return renderLogin(res, req.body.email, req.body.password, errors.array());      
  }
  User.findOne( {email: req.body.email} )
    .then(user => {      
      if (!user) {        
        return renderLogin(res, req.body.email, req.body.password, [{param: 'email', msg: 'Invalid credentials'}]);              
      }             
      bcrypt.compare(req.body.password, user.password)
      .then(matches => {
        if (matches) {          
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            res.redirect('/beemazon/shop');
          });          
        }                
        return renderLogin(res, req.body.email, req.body.password, [{param: 'email', msg: 'Invalid credentials'}]);
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });   
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });   
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/beemazon/shop');
  })
};

exports.getSignup = (req, res, next) => {
  res.render('Beemazon/pages/auth/signup', {
    path: '/signup',
    pageTitle: 'Register New Account',
    errorMessage: [],
    oldInput: { 
      name: '', 
      email: '', 
      password: '',  
      confirmPassword: ''
    }
  });
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('Beemazon/pages/auth/signup', {
        path: '/signup',
        pageTitle: 'Register New Account',
        errorMessage: errors.array(),
        oldInput: { 
          name: req.body.name, 
          email: req.body.email, 
          password: req.body.password,  
          confirmPassword: req.body.confirmPassword
        }
    });
  } 
  bcrypt
    .hash(req.body.password, 12)
    .then(hashedPwd => {
      const user = new User({
        email: req.body.email,
        password: hashedPwd,
        name: req.body.name
      });
      return user.save();
    })                  
    .then(result => {
      res.redirect('/beemazon/auth/login');
      return transporter.sendMail({
        to: req.body.email,
        from: 'registration@beemazon.com',
        subject: 'Beemazon Registration',
        html: `<h1>Welcome to Beemazon</h1>
                <p>You're on your way to becoming a master apiarist.</p>`
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });   
    });
};

exports.getReset = (req, res, next) => {
  res.render('Beemazon/pages/auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: getErrorMessage(req.flash('error'))
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/beemazon/auth/reset');
    }
    const token = buffer.toString('hex');
    User.findOne( {email: req.body.email})
    .then(user => {
      if(!user) {
        req.flash('error', 'No account found for that email address.');
        return res.redirect('/beemazon/auth/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000; //1 hr
      return user.save();
    })
    .then(result => {
      res.redirect('/beemazon/shop');
       transporter.sendMail({
        to: req.body.email,
        from: 'authentication@beemazon.com',
        subject: 'Beemazon Password Reset',
        html: `<h1>Beemazon Credentials Reset</h1>
          <p>You requested a password reset.</p>             
          <p>Click <a href="${EMAILURL}beemazon/auth/reset/${token}">this link</a> to set a new password.</p>`
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });   
  });
};

exports.getNewPassword = (req, res, next) => {    
  User.findOne({resetToken: req.params.token, resetTokenExpiry: {$gt: Date.now()}})
  .then(user => {        
    if(!user) {
      return res.redirect('/beemazon/auth/reset');
    }    
    res.render('Beemazon/pages/auth/new-password', {
      path: '/new-password',
      pageTitle: 'Reset Password',
      userId: user._id.toString(),
      pwdToken: req.params.token,
      password: '',
      errorMessage: []
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });   
};

exports.postNewPassword = (req, res, next) => { 
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {
    let errorsArray = errors.array();   
    return res
      .status(422)
      .render('Beemazon/pages/auth/new-password', {
        path: '/new-password',
        pageTitle: 'Reset Password',
        errorMessage: errorsArray,
        userId: req.body.userId,
        pwdToken: req.body.pwdToken,
        password: req.body.password
      });
  } 
  let resetUser;
  User.findOne({  
    resetToken: req.body.pwdToken, 
    resetTokenExpiry: {$gt: Date.now()},
    _id: req.body.userId
  })
  .then(user => {
    if (!user) {
      return res.redirect('/beemazon/auth/reset');
    }
    resetUser = user;        
    bcrypt.hash(req.body.password, 12)
    .then(hashed => {    
      resetUser.password = hashed;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiry = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/beemazon/auth/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });    
  });
};