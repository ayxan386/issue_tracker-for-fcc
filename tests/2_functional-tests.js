/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "Functional Test - Every field filled in");  
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
          const id = "123123"
          chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test 2',
          issue_text: 'requireds only',
          created_by: 'Tester'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Test 2");
          assert.equal(res.body.issue_text, "requireds only");
          assert.equal(res.body.created_by, "Tester");  
          done();
        });
      });
      
      test('Missing required fields', function(done) {
          chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test 3',
          created_by: 'Tester'
        })
        .end(function(err, res){
          //console.log(res);
          assert.equal(res.body.error, "missing some fields");
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, "no updated field sent")
          done();
        });
      });
      
      test('One field to update', function(done) {
        const id = "5d615d7d31f3863cccc85324"
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: id,
          issue_title: "Changed title"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, "successfully updated " + id)
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        const id = "5d615c549dc4c8376ac5fd27"
          chai.request(server)
        .put('/api/issues/apitest')
        .send(
            {
          _id: id,
          issue_title: "Changed title",
          created_by: "another test"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, id)
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
         // console.log(res.body);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
         chai.request(server)
        .get('/api/issues/apitest')
        .query({open:true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
         chai.request(server)
        .get('/api/issues/test')
        .query({open : true,
               created_by: "Tester"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        const id = "";
        chai.request(server)
        .delete('/api/issues/test')
        .send(
            {
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, "_id error");
          done();
        });
      });
      
      test('Valid _id', function(done) {
        const id = "5d615d96fe073b3cffef0be9";
        chai.request(server)
        .delete('/api/issues/test')
        .send(
            {
              _id:id
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, id);
          done();
        });
      });
      
    });

});
