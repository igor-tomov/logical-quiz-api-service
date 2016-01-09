var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('./utils');



/**
 * Question option schema
 */
var QuestionOptionSchema = new Schema({
  value: {
    type: Schema.Types.Mixed,
    required: true
  }
});



QuestionOptionSchema.methods.toClient = function( locale ){
  var object = utils.normalizeId( this.toObject() );

  if ( locale ){
    object = utils.localizeField( object, 'value', locale );
  }

  return object;
};


/**
 * Question item Schema
 */
var QuestionSchema = new Schema({

  target: {
    type: Number,
    required: true
  },

  level: {
    type: Number,
    default: 0
  },

  desc: String,

  options: {
    type: [QuestionOptionSchema],
    required: true
  }
});

QuestionSchema.methods.toClient = function( locale, shuffle ){
  var question = utils.normalizeId( this.toObject() );

  question.options = this.options.map( item => item.toClient( locale ) );

  if ( shuffle ){
    question.options = utils.shuffleList( question.options );
  }

  return question;
};



/**
 * Quiz schema
 */
var QuizSchema = new Schema({

  title: {
    type: Schema.Types.Mixed,
    required: true
  },

  questions: {
    type: [QuestionSchema],
    default: []
  },

  desc: {
    type: String,
    default: ''
  },

  thumbnail: {
    type: String,
    default: ''
  }
});



QuizSchema.methods.toClient = function( locale ){
  var object = utils.normalizeId( this.toObject({ versionKey: false }) );

  if ( locale ){
    object = utils.localizeField( object, 'title', locale );
  }

  object.questions = this.questions.map( item => item.toClient( locale, true /* todo: make it configurable */ ) );
  
  return object;
};



// exports
exports.QuestionOption  = mongoose.model( "QuestionOption", QuestionOptionSchema );
exports.Question        = mongoose.model( "Question", QuestionSchema );
exports.Quiz            = mongoose.model( "Quiz", QuizSchema );