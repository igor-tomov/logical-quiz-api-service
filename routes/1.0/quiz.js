var logger = require('../../logger');
var tv4    = require('tv4');
var models = require('../../models/quiz');
var utils  = require('../utils');

// expose models
var Quiz     = models.Quiz;
var Question = models.Question;
var QuestionOption = models.QuestionOption;


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



var quizQuestionSchema = {
  required: ['target', 'options'],
  properties: {
    target: {
      type: "number",
      minimum: 1
    },
    level: {
      "type": "number",
      "minimum": 1
    },
    options: {
      "type": "array",
      "items": {
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
      "minItems": 4,
      "uniqueItems": true
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
  }
}



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
      res.status( 422 ).json( utils.prepareValidationErrorResponse( result.errors ) );
      return;
    }

    var quiz = new Quiz( body );

    quiz.save( err => {
      if ( err ) throw err;
      res.status( 201 ).json( quiz.toClient( req.locale ) );
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
    var body = req.body;
    var result = tv4.validateMultiple( body, quizQuestionSchema );
    var options, question;

    if ( ! result.valid ){
      logger.debug( result.errors );
      res.status( 422 ).json( utils.prepareValidationErrorResponse( result.errors ) );
      return;
    }
    
    if ( body.target > body.options.length ){
      res.status( 422 ).json( utils.prepareValidationErrorResponse({
        dataPath: "/target",
        message: '"target" value is out of "options" index range'
      }));
      
      return;
    }

    // find target quiz entity
    Quiz.findById( req.params.id, 'questions', ( err, quiz ) => {
      if ( err ) throw err;

      if ( ! quiz ){
        res.status(400).json({
          error: `Quiz entity '${req.params.id}' isn't found`
        });

        return;
      }

      // build option models for new question
      options = body.options.map( item => new QuestionOption({ value: item }) );

      // create new question and add to quiz
      question = new Question( Object.assign( {}, body, {
        options: options,
        target: options[body.target - 1].id
      }));

      quiz.questions.push( question );

      // save updated quiz
      quiz.save( err => {
        if ( err ) throw err;
        res.status( 201 ).json( question.toClient( req.locale ) );
      });
    });
  });



  router.put( '/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {
    //todo: implement
  });




  router.delete( '/1.0/quizzes/:quiz_id/questions/:question_id', ( req, res ) => {
    var quizId = req.params.quiz_id,
        questionId = req.params.question_id;

    Quiz.findById( quizId, 'questions', ( err, quiz ) => {
      var question;

      if ( err ) throw err;

      if ( ! quiz ){
        res.status(400).json({
          error: `Quiz entity '${quizId}' isn't found`
        });

        return;
      }

      // find target question
      question = quiz.questions.id( questionId );

      if ( ! question ){
        res.status(404).end();
        return;
      }

      // remove question
      question.remove();

      // save updated quiz
      quiz.save( err => {
        if ( err ) throw err;
        res.status( 204 ).end();
      });
    });
  });

};
