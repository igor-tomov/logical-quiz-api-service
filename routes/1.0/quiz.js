var logger = require('../../logger');
var tv4    = require('tv4');
var Quiz   = require('../../models/quiz').Quiz;
var utils  = require('../utils');


/**
 * JSON schema of Quiz entities
 */
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
      res.status( 422 ).json( utils.prepareErrorResponse( result.errors ) );
      return;
    }

    var quiz = new Quiz( body );

    quiz.save( err => {
      if ( err ) throw err;
      res.status( 201 ).json( quiz.toClient() );
    });
  });



  router.put( '/1.0/quizzes/:id', ( req, res ) => {
    //todo: implement
  });



  router.delete( '/1.0/quizzes/:id', ( req, res ) => {
    Quiz.findByIdAndRemove( req.params.id, ( err, quiz ) => {
      res.status(quiz ? 204 : 404).end();
    })
  });



  router.post( '/1.0/quizzes/:id/questions', ( req, res ) => {
    //todo: implement
  });



  router.put( '/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {
    //todo: implement
  });




  router.delete( '/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {
    //todo: implement
  });

};
