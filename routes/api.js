/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app,db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let query = Object.assign({projectname: project},req.query);
     // console.log(query);
      if(query.open)
        {
          if(query.open === "true")query.open = true;
            else query.open = false;
        }
      db.collection("issues").find(query)
        .toArray((err,doc) => {
               res.json(doc);
          });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      //console.log(req.body);
      if(req.body.issue_title && req.body.issue_text && req.body.created_by)
      {
        db.collection("issues").insert({
        projectname: project,
        issue_title: req.body["issue_title"],
        issue_text: req.body["issue_text"],
        created_by: req.body["created_by"],
        assigned_to: req.body["assigned_to"] || null,
        status_text: req.body["status_text"] || null,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        open: true
      },(err,doc) => {
        if(err)console.log(err);
        res.json(doc.ops[0]);
      });
      }
      else {
          res.send({error: "missing some fields"});
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      let open = true;
      if(req.body.open)
          {
            if(req.body.open !== "true")open = false;
          }
      if(req.body._id || req.body.issue_title || req.body.issue_text || req.body.created_by
        || req.body.assigned_to || req.body.status_text || req.body.open){
        db.collection("issues").findOne({_id : new ObjectId(req.body._id)},(err,doc) => {
        db.collection("issues").findOneAndReplace(
        /*filter or query*/{_id : new ObjectId(req.body._id)},
        {
            projectname: project,
            issue_title: req.body.issue_title || doc.issue_title,
            issue_text: req.body.issue_text || doc.issue_text,
            created_by: req.body.created_by || doc.created_by,
            assigned_to: req.body.assigned_to || doc.assigned_to,
            status_text: req.body.status_text || doc.status_text,
            created_on: doc.created_on,
            updated_on: new Date().toUTCString(),
            open: open || doc.open
           },
            (err,doc) => {
            if(err){console.log(err);
                    res.json("could not update " + req.body._id);
                   }
              else 
                res.json("successfully updated " + req.body._id);
          }
      );  
      });
      }
    else {
      res.json("no updated field sent");
    }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(req.body._id){
        db.collection("issues").findOneAndDelete({
          _id : new ObjectId(req.body._id)
        },
        (err,doc) => {
          if(err)res.json("could not delete " + req.body._id);
          else {
            res.json("deleted " + req.body._id);
          }
        })
      }
      else {
        res.json("_id error");
      }
    });
    
};
