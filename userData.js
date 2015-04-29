var express = require('express');
var request = require('request');
var fs = require('fs');

var neo4j = require('node-neo4j');
var db = new neo4j('http://neo4j:ayanami00@localhost:7474');

//set headers
var headers = {
    'User-Agent':       'schoenflies',
    'Content-Type':     'application/json',
    'Authorization': 'token d070ac64717e3b3f5ab47559b68a2c6d1fce6859'
};

var getFollowing = function (user){
  var following = [];
  var url = 'https://api.github.com/users/'+user+'/following';
  console.log('-------FOLLOWING URL:'+url);

    //configure request
    var options = { url: url, method: 'GET', headers: headers,};
    
    request(options, function(error, response, html){

      // First we'll check to make sure no errors occurred when making the request

      if(!error){

          var data = JSON.parse(response.body);

          for(var i=0; i<data.length; i++){
            for(var key in data[i]){
              if(key === 'login'){
                following.push(data[i][key]);
              }//end if
            }//end for var key
          }//end for var i


          db.insertNode({ name: user,following:following}, function (err, node) {
            if (err) {return console.log(err);}
            // // Output node data.
            // console.log(node);
            var data = [node._id,user];
            //write to file
            fs.appendFile('users.txt',JSON.stringify(data),function(err,results){
              if (err) throw err;
            })
          });//end db.insert

      }//end if !error
    })//ends request
}//ends function

exports = module.exports = getFollowing;
