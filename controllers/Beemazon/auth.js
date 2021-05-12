const bcrypt = require('bcryptjs');
const User = require('../../models/Beemazon/user')

function getErrorMessage(flash) {
  return flash.length > 0 ? flash[0] : null;
}

exports.getLogin = (req, res, next) => {
  res.render('Beemazon/pages/auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: getErrorMessage(req.flash('error'))
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne( {email: req.body.email} )
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid credentials.');
        return res.redirect('/beemazon/auth/login');
      }
      bcrypt.compare(req.body.password, user.password)
      .then(matches => {
        if (matches) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            res.redirect('/beemazon/');
          });          
        }
        req.flash('error', 'Invalid credentials.');
        res.redirect('/beemazon/auth/login');
      })
      .catch(err => {        
        console.log(err);
        req.flash('error', 'System Error.');
        res.redirect('/beemazon/auth/login');
      });
    });
    
  res.redirect('/', );
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/beemazon/');
  })
};

exports.getSignup = (req, res, next) => {
  res.render('/beemazon/auth/signup', {
    path: '/signup',
    pageTitle: 'Register Account',
    errorMessage: getErrorMessage(req.flash('error'))
  });
};

exports.postSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(userDoc => {
    if (userDoc) {
      req.flash('error', 'Email is already associated with an account.');
      return res.redirect('/beemazon/auth/signup');
    }
    return bcrypt
      .hash(req.body.password, 12)
      .then(hashedPwd => {
        const user = newUser({
          email: req.body.email,
          password: hashedPwd,
          name: req.body.name
        });
        return user.save();
      })                  
      .then(result => {
        res.redirect('/beemazon/auth/login');
      });
  })  
  .catch(err => console.log(err));
};