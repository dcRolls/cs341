module.exports = (req, res, net) => {
  if(!req.session.isLoggedIn) {
    return res.redirect('/beemazon/auth/login');
  }
  next();
}