const routes = require('express').Router();

const shopRoutes = require('./shop');
const adminRoutes = require('./admin');
const errorController = require('../../controllers/Beemazon/error');

routes.use('/admin', adminRoutes);

routes.use('/shop', shopRoutes);

routes.use('/', (req, res, next) => {
    res.redirect('/beemazon/shop'); //send to shop page
});

routes.use(errorController.get404);

module.exports = routes;