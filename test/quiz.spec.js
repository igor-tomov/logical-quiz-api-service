/**
 * Test Quizzes CRUD operations via REST API
 */
var request = require('supertest');
var expect  = require('chai').expect;



// retrieve REST API endpoint
var endpoint = process.env.TEST_SERVER || process.argv.reduce( ( res, item, i ) => {
  if ( item.indexOf( '--server' ) === 0 && process.argv[i + 1] ){
    return process.argv[i + 1];
  }

  return res;
}, 'http://localhost:8081');



describe( "Quizzes CRUD operation", function(){

    before(function(done){
        //define test quiz entity
        this.testQuiz = {
          "title": {
          "en": "Geography",
          "ru": "География"
          },
          "desc": {
            "en": "Try to determine logic link between geographic entities(coutries, cities, rivers, .etc)",
            "ru": "Попробуйте определить логическую связь между географическими сущностями(страны, города и т.д.)"
          },
          "thumbnail": "path/to/thumbnail.jpg",
          "questions": [
            {
              "target": 1,
              "options": [
                "Hungary",
                "Montenegro",
                "Serbia",
                "Croatia"
              ]
            },
            {
              "target": 2,
              "level": 2,
              "desc": {
                "en": "Which country is not a part of Scandinavia",
                "ru": "Какая из стран не является частью Скандинавии"
              },
              "options": [
                {
                  "en": "Sweden",
                  "ru": "Швеция"
                },
                {
                  "en": "Switzerland",
                  "ru": "Швейцария"
                },
                {
                  "en": "Danish",
                  "ru": "Дания"
                },
                {
                  "en": "Norwegian",
                  "ru": "Норвегия"                  
                }
              ]
            },
          ]
        };

        // stored id of entities which will be created during the test suite execution
        this.createdQuizId = null;
        this.createdQuizQuestionId = null;

        // check connection with REST-server
        request( endpoint )
              .get("/1.0/quizzes")
              .end( ( err, res ) => {
                if ( err ) throw err;
                done();
              });
    });



    beforeEach(function(){
      this.timeout( 5000 );
    });



    it( "Reset quizzes", function(done){
      request( endpoint )
            .post('/1.0/quizzes/reset')
            .expect(204)
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });


    /*************** POST Quiz entity ***************/
    it( "Post new quiz entity, pass title as string", function(done){
      var quiz = {
        title: this.testQuiz.title.en
      };

      request( endpoint )
            .post('/1.0/quizzes')
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( quiz ) )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'id', 'title', 'desc', 'thumbnail', 'questions');
              expect( res.body.title ).to.equal( quiz.title );
              expect( res.body.desc ).to.be.empty;
              expect( res.body.thumbnail ).to.be.empty;
              expect( res.body.questions )
                .to.be.an( 'array' )
                .and.to.be.empty;
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Post new quiz entity, pass title as locale object", function(done){
      var quiz = {
        title: this.testQuiz.title
      };

      request( endpoint )
            .post('/1.0/quizzes')
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( quiz ) )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'id', 'title', 'desc', 'thumbnail', 'questions');
              expect( res.body.title ).to.deep.equal( quiz.title.en );
              expect( res.body.desc ).to.be.empty;
              expect( res.body.thumbnail ).to.be.empty;
              expect( res.body.questions )
                .to.be.an( 'array' )
                .and.to.be.empty;
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Post new quiz entity, pass title with invalid locale object and receive validation error", function(done){
      var quiz = {
        title: {
          en: 'En locale',
          ru: {
            value: 'Ru locale'
          }
        }
      }

      request( endpoint )
            .post('/1.0/quizzes')
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( quiz ) )
            .expect(422)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'error', 'message' );
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Post new quiz entity, pass title as locale object, desc as string and thumbnail", function(done){
      var quiz = {
        title: this.testQuiz.title,
        desc: this.testQuiz.desc.en,
        thumbnail: this.testQuiz.thumbnail
      };

      request( endpoint )
            .post('/1.0/quizzes')
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( quiz ) )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'id', 'title', 'desc', 'thumbnail', 'questions');
              expect( res.body.title ).to.deep.equal( quiz.title.en );
              expect( res.body.desc ).to.equal( quiz.desc );
              expect( res.body.thumbnail ).to.equal( quiz.thumbnail );
              expect( res.body.questions )
                .to.be.an( 'array' )
                .and.to.be.empty;
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Post new quiz entity, pass title as locale object, desc as locale object and thumbnail", function(done){
      var quiz = {
        title: this.testQuiz.title,
        desc: this.testQuiz.desc,
        thumbnail: this.testQuiz.thumbnail
      };

      request( endpoint )
            .post('/1.0/quizzes')
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( quiz ) )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'id', 'title', 'desc', 'thumbnail', 'questions');
              expect( res.body.title ).to.deep.equal( quiz.title.en );
              expect( res.body.desc ).to.deep.equal( quiz.desc.en );
              expect( res.body.thumbnail ).to.equal( quiz.thumbnail );
              expect( res.body.questions )
                .to.be.an( 'array' )
                .and.to.be.empty;
            })
            .end( (err, res) => {
              if (err) return done(err);
              this.createdQuizId = res.body.id;
              done();
            });
    });


    
    it( "Post new quiz entity without params and receive validation error", function(done){
      request( endpoint )
            .post('/1.0/quizzes')
            .set('Content-Type', 'application/json')
            .send()
            .expect(422)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'error', 'message' );
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    /*************** POST Quiz question entity ***************/
    it( "Post new question entity, pass all options as string", function(done){
      var question = this.testQuiz.questions[0];

      request( endpoint )
            .post(`/1.0/quizzes/${this.createdQuizId}/questions`)
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( question ) )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'id', 'target', 'level', 'desc', 'options');
              expect( res.body.level ).to.equal(1);
              expect( res.body.desc ).to.be.empty;
              expect( res.body.options ).to.be.an( 'array' );
              expect( res.body.options.length ).to.equal( question.options.length );

              res.body.options.forEach( item => {
                expect( item ).to.have.all.keys( 'id', 'value' );
                expect( question.options.indexOf( item.value ) ).to.not.equal(-1);
              });
            })
            .end( (err, res) => {
              if (err) return done(err);
              this.createdQuizQuestionId = res.body.id;
              done();
            });
    });



    it( "Post new question entity, pass all options as locale objects and desc as string", function(done){
      var question = this.testQuiz.questions[1];
      var options  = question.options.map( item => item.en );

      request( endpoint )
            .post(`/1.0/quizzes/${this.createdQuizId}/questions`)
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( question ) )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'id', 'target', 'level', 'desc', 'options' );
              expect( res.body.level ).to.equal( question.level );
              expect( res.body.desc ).to.equal( question.desc.en );
              expect( res.body.options ).to.be.an( 'array' );
              expect( res.body.options.length ).to.equal( question.options.length );

              res.body.options.forEach( item => {
                expect( item ).to.have.all.keys( 'id', 'value' );
                expect( options.indexOf( item.value ) ).to.not.equal(-1);
              });
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Post new question entity without params and recieve validation error", function(done){
      request( endpoint )
            .post(`/1.0/quizzes/${this.createdQuizId}/questions`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(422)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'error', 'message' );
              expect( res.body.message ).to.be.an( 'array' );
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });


    it( "Post new question entity without one required param and recieve validation error", function(done){
      var question = Object.assign( {}, this.testQuiz.questions[1] );

      delete question.target;

      request( endpoint )
            .post(`/1.0/quizzes/${this.createdQuizId}/questions`)
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( question ) )
            .expect(422)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'error', 'message' );
              expect( res.body.message ).to.be.an( 'string' );
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Post new question entity without few required params and recieve validation error", function(done){
      var question = Object.assign( {}, this.testQuiz.questions[1] );

      delete question.target;
      delete question.options;

      request( endpoint )
            .post(`/1.0/quizzes/${this.createdQuizId}/questions`)
            .set('Content-Type', 'application/json')
            .send( JSON.stringify( question ) )
            .expect(422)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body ).to.have.all.keys( 'error', 'message' );
              expect( res.body.message ).to.be.an( 'array' );
            })
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    /*************** GET Quiz list ***************/
    it( "GET /1.0/quizzes", function ( done ) {
        request( endpoint )
            .get( "/1.0/quizzes" )
            .expect(200)
            .expect(function ( res ) {
                expect( res.body.quizzes ).to.be.an( 'array' );
                expect( res.body.quizzes.length ).to.equal( 4 );
                expect( res.body.quizzes[0] ).to.have.all.keys( 'id', 'title', 'desc', 'thumbnail' );
            })
            .end( (err, res) => {
                if (err) return done(err);
                done();
            });

    });


    it( "GET /1.0/quizzes/:id", function ( done ) {
        request( endpoint )
            .get( "/1.0/quizzes/" + this.createdQuizId )
            .expect(200)
            .expect(function ( res ) {
                expect( res.body.quiz ).to.have.all.keys( 'id', 'title', 'desc', 'thumbnail', 'questions' );
            })
            .end( (err, res) => {
                if (err) return done(err);
                done();
            });
    });



    /*************** GET Quiz questions ***************/
    it( "GET /1.0/quizzes/:id/questions/random - get random question list of particular quiz", function ( done ) {
        request( endpoint )
            .get( `/1.0/quizzes/${this.createdQuizId}/questions/random` )
            .expect(200)
            .expect(function ( res ) {
                expect( res.body.questions ).to.be.an( 'array' );
            })
            .end( (err, res) => {
                if (err) return done(err);
                done();
            });
    });



    it( "GET /1.0/quizzes/:id/questions/random - get random question list of particular quiz with request count", function ( done ) {
        request( endpoint )
            .get( `/1.0/quizzes/${this.createdQuizId}/questions/random?count=1` )
            .expect(200)
            .expect(function ( res ) {
                expect( res.body.questions ).to.be.an( 'array' );
                expect( res.body.questions.length ).to.equal( 1 );
            })
            .end( (err, res) => {
                if (err) return done(err);
                done();
            });
    });



    /*************** Delete Quiz question entity ***************/
    it( "Delete existing question entity", function(done){
      request( endpoint )
            .del( `/1.0/quizzes/${this.createdQuizId}/questions/${this.createdQuizQuestionId}` )
            .expect(204)
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Try to delete non-existand question entity and receive 404", function(done){
      request( endpoint )
            .del( `/1.0/quizzes/${this.createdQuizId}/questions/${this.createdQuizQuestionId}` )
            .expect(404)
            .end( (err, res) => {
              if (err) return done(err);
              this.createdQuizQuestionId = null;
              done();
            });
    });



    /*************** Delete Quiz entity ***************/
    it( "Delete existing quiz entity", function(done){
      request( endpoint )
            .del('/1.0/quizzes/' + this.createdQuizId )
            .expect(204)
            .end( (err, res) => {
              if (err) return done(err);
              done();
            });
    });



    it( "Try to delete non-existand quiz entity and receive 404", function(done){
      request( endpoint )
            .del('/1.0/quizzes/' + this.createdQuizId )
            .expect(404)
            .end( (err, res) => {
              if (err) return done(err);
              this.createdQuizId = null;
              done();
            });
    });
});