var express = require('express');
var fs = require('fs');
var request = require('request');
var $ = require('cheerio')
var path = require('path');
var underscore = require('underscore');

var app = express();
var users = [];

//string contains
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

app.get('/', function(req, res){

  // All the web scraping magic will happen here
          var start = 'https://api.github.com/users';
          //set headers
          var headers = {
              'User-Agent':       'schoenflies',
              'Content-Type':     'application/json'
          };



      // for(var j=0; j<2; j++){
      function getUsers(url,num){
        if(num>2){
          return;
        }
          //configure request
          var options = {
              url: url,
              method: 'GET',
              headers: headers,
          };
          request(options, function(error, response, html){

            // First we'll check to make sure no errors occurred when making the request

            if(!error){
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var parsedHTML = $.load(html);
                }
                var data = JSON.parse(response.body);
                
                for(var i=0; i<data.length; i++){
                  for(var key in data[i]){
                    if(key === 'login'){
                      users.push(data[i][key]);
                    }
                  }
                }

                //write to file
                fs.appendFile('users.txt', JSON.stringify(users), function (err) {
                  if (err) throw err;
                  console.log('DATA SAVED!');
                });


                if(response.headers.link.contains('rel="next"')){
                  //update url
                  var end = response.headers.link.indexOf('>');
                  var newUrl = response.headers.link.slice(1,end);
                  console.log('--------NEWURL:'+url);
                }//ends if(!error)

                num++;
                getUsers(newURL, num);
            })//ends request
          }
          // }//ends for loop
  getUsers(start,0);

  res.sendFile(path.join(__dirname+'/index.html'));
});
app.listen('3000');

console.log('Magic happens on port 3000');

exports = module.exports = app;
