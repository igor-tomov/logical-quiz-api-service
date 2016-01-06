var mongoose = require('mongoose');
var logger = require('../logger');

var Quiz = require('./quiz').Quiz;


/**
 * Synchronize Database
 */
function syncDatabase(){
  Quiz.findOne( ( err, quiz ) => {
    if ( err ) throw err;

    if ( ! quiz ){
      Quiz().save( err => {
        if ( err ) throw err;
        logger.info( "Default Quiz DB has been created" );
      });
    }
  });
}



exports.connect = function( config ){
  mongoose.connect( config.endpoint );

  mongoose.connection.on( "connected", () => {
    logger.info( 'Mongoose connection open to: ', config.endpoint );

    //syncDatabase();
  });

  mongoose.connection.on('error', function ( err ) {
    throw new Error( err );
  });

  // close the Mongoose connection in case of node process termination
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
};