/**
 * Test Quizzes CRUD operation via REST API
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

    it( "Create new quiz entity, pass title as string", function(){
      var quiz = {
        title: "Quiz with title as string"
      };

      request( endpoint )
            .post('/api/1.0/quizzes')
            .send( quiz )
            .expect(201)
            .expect( "Content-Type", /json/ )
            .expect(function( res ){
              expect( res.body )
                .to.have.property( 'title', quiz.title )
                .and.have.property( 'desc', '' )
                .and.have.property( 'thumbnail', '' )
                .and.have.property( 'questions', [] );
            });
    });
});