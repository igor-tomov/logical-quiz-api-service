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
}, 'http://localhost:8080');



describe( "Quizzes CRUD operation", function(){

    before(function(){
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
          "questions": []
        };
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



    it( "Create new quiz entity, pass title as string only", function(done){
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
});