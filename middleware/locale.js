/**
 * Retrieve current locale from cookie
 */
var config = require('../config');

module.exports = function( req, res, next ){
  var cookies = req.cookies;

  req.locale = cookies && cookies.locale ? cookies.locale : config.defaultLocale;

  next();
};