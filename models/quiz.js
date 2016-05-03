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
  var object = utils.normalizeId( this.toObject({ versionKey: false }) );

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
    type: String,
    required: true
  },

  level: {
    type: Number,
    default: 1
  },

  desc: {
    type: Schema.Types.Mixed,
    default: ''
  },

  options: {
    type: [QuestionOptionSchema],
    required: true
  }
});



QuestionSchema.methods.toClient = function( locale, shuffle ){
  var question = utils.normalizeId( this.toObject({ versionKey: false }) );

  question.options = this.options.map( item => item.toClient( locale ) );

  if ( question.desc && locale ){
    question = utils.localizeField( question, 'desc', locale );
  }

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
    type: Schema.Types.Mixed,
    default: ''
  },

  thumbnail: {
    type: String,
    default: ''
  }
});



QuizSchema.methods.shuffleQuestions = function () {
  this.questions = utils.shuffleList( this.questions );
  return this;
};



QuizSchema.methods.sliceQuestions = function ( begin, end ) {
  this.questions = this.questions.slice( begin, end );
  return this;
};



QuizSchema.methods.toClient = function( locale, shuffleQuestions ){
  var object = utils.normalizeId( this.toObject({ versionKey: false }) );

  if ( locale && object.title ){
    object = utils.localizeField( object, 'title', locale );

    if ( object.desc && object.desc ){
      object = utils.localizeField( object, 'desc', locale );
    }
  }

  if ( Array.isArray( this.questions ) ) {
    object.questions = this.questions.map(item => item.toClient(locale, shuffleQuestions));
  }
  
  return object;
};



// exports
exports.QuestionOption  = mongoose.model( "QuestionOption", QuestionOptionSchema );
exports.Question        = mongoose.model( "Question", QuestionSchema );
exports.Quiz            = mongoose.model( "Quiz", QuizSchema );