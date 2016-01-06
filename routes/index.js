var express = require('express');
var router = express.Router();
var config = require( '../config' );



/* GET welcome */
router.get('/', function(req, res, next) {
  res.end('Welcome to "Logical Quiz Service"');
});



// load api routes
require( './1.0/quiz' )( router, config );



module.exports = router;
