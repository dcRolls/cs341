exports.getLogin = (req, res, next) => {
  res.render('Beemazon/pages/auth/login', {
    path: '/login',
    pageTitle: 'Login'          
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', '');
  res.redirect('/', );
};

exports.postLogout = (req, res, next) => {

};