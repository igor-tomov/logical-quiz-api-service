var logger = require('../../logger');
var tv4    = require('tv4');
var Quiz   = require('../../models/quiz').Quiz;



var quizSchema = {
  required: ['title'],
  properties: {
    title: {
      oneOf: [
        {
          "type": "string"
        },
        {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
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

  router.get( '/1.0/quizzes/', ( req, res ) => {
    res.end('OK');
  });




  /********************* write operations ********************/

  router.post( '/1.0/quizzes/reset', ( req, res ) => {
    Quiz.remove({}, err => {
      if ( err ) throw err;
      logger.warn( "Quiz data has been reset" );
      res.status(204).end();
    });
  });



  router.post( '/1.0/quizzes', ( req, res ) => {
    var body = req.body;
    var result = tv4.validateMultiple( body, quizSchema );

    if ( ! result.valid ){
      logger.debug( result.errors );
      res.status( 400 ).end( result.missing );
      return;
    }

    var quiz = new Quiz( body );

    quiz.save( err => {
      if ( err ) throw err;
      res.status( 201 ).json( quiz.toClient() );
    });
  });



  router.put( '/1.0/quizzes/:id', ( req, res ) => {

  });



  router.delete( '/1.0/quizzes/:id', ( req, res ) => {

  });



  router.post( '/1.0/quizzes/:id/questions', ( req, res ) => {

  });



  router.put( '/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {

  });




  router.delete( '/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {

  });

};
