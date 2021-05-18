module.exports = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    return res.redirect('/beemazon/auth/login');
  }
  next();
}