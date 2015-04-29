var express = require('express');
var request = require('request');

var path = require('path');
var underscore = require('underscore');

var neo4j = require('node-neo4j');
var db = new neo4j('http://neo4j:ayanami00@localhost:7474');

var getFollowing = require('./userData');

var app = express();

//String prototype
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

//set headers
var headers = {
    'User-Agent':       'schoenflies',
    'Content-Type':     'application/json',
    'Authorization': 'token d070ac64717e3b3f5ab47559b68a2c6d1fce6859'
};

app.get('/getData', function(req, res){

  // All the web scraping magic will happen here
      var start = 'https://api.github.com/users';

      function getUsers(url,num){

        console.log('-------URL:'+url);
        if(num>1){ return;}
          //configure request
          var options = { url: url, method: 'GET', headers: headers,};
          
          request(options, function(error, response, html){

            // First we'll check to make sure no errors occurred when making the request

            if(!error){

                var data = JSON.parse(response.body);

                //iterate over logins
                for(var i=0; i<data.length; i++){
                  for(var key in data[i]){
                    if(key === 'login'){
                      var user = data[i][key];
                      //write to database
                      getFollowing(data[i][key]);
                    }//end if
                  }//end for var key
                }//end for var i


                if(response.headers.link.contains('rel="next"')){
                  var end = response.headers.link.indexOf('>');
                }//ends if response.headers
            }//ends if(!error)

              num++;
              getUsers(response.headers.link.slice(1,end), num);
            })//ends request
        }//ends function
  getUsers(start,0);

  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/graph', function(req, res){
  res.sendFile(path.join(__dirname+'/graph.html'));
});

app.get('/graph.json', function(req, res){
  res.sendFile(path.join(__dirname+'/graph.json'));
});

app.get('/data.json', function(req, res){
  res.sendFile(path.join(__dirname+'/data.json'));
});

app.listen('3000');

console.log('Magic happens on port 3000');


exports = module.exports = app;
