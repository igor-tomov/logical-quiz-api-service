var logger = require('../../logger');
var tv4    = require('tv4');
var Quiz   = require('../../models/quiz').Quiz;



var quizSchema = {
  required: ['title'],
  properties: {
    title: {
      oneOf: [
        { type: 'string' },
        { type: 'object' }
      ]
    },
    desc: {
      type: 'string'
    },
    thumbnail: {
      type: 'string'
    }
  }
};


module.exports = function( router, config ){

  router.get( '/api/1.0/quizzes/', ( req, res ) => {
    res.end('OK');
  });




  /********************* write operations ********************/

  router.post( '/api/1.0/quizzes/reset', ( req, res ) => {
    Quiz.findOneAndRemove( {}, err => {
      if ( err ) throw err;
      logger.warn( "Quiz data has been reset" );
      res.status(200).end();
    });
  });



  router.post( '/api/1.0/quizzes', ( req, res ) => {

  });



  router.put( '/api/1.0/quizzes/:id', ( req, res ) => {

  });



  router.delete( '/api/1.0/quizzes/:id', ( req, res ) => {

  });



  router.post( '/api/1.0/quizzes/:id/questions', ( req, res ) => {

  });



  router.put( '/api/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {

  });




  router.delete( '/api/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {

  });

};
