var express = require('express');
var fs = require('fs');
var request = require('request');
var $ = require('cheerio')
var app = express();

var periodicTable = {};

app.get('/', function(req, res){

  //All the web scraping magic will happen here

    // url = 'http://www.nndc.bnl.gov/wallet/zz11/z001.html'; // DO THIS z001.html through z118.html

    var num, url;
    for (var j = 1; j <= 118; j++) {
      if(j< 10) {
        num = "00" + j;
      } else if (j<100) {
        num = '0'+j;
      } else {
        num = ''+j;
      }
      url = 'http://www.nndc.bnl.gov/wallet/zz11/z'+num+'.html';

      request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var parsedHTML = $.load(html);
            var max = parsedHTML('tr').length-1;  

            var element = {};
                 
            parsedHTML('tr').each(function(i, tr) {
            // the foo html element into a cheerio object (same pattern as jQuery)
              if(i === 2) {
                var text = $(tr).text();
                text = text.split('\n');
                element.Z = parseInt(text[1]);
                element.symbol = text[2];
                element.isotopes = [];
                var isotope = {};
                isotope.A = parseInt(text[3]);
                isotope.stability = text[6];
                isotope.decay = text[7] === ' ' ? 'Stable' : text[7];
                element.isotopes.push(isotope); //

              }
              if(i>2 && i<max) {
                var text = $(tr).text();
                text = text.split('\n');
                var isotope = {};
                isotope.A = parseInt(text[3]);
                isotope.stability = text[6];
                isotope.decay = text[7] === ' ' ? 'Stable' : text[7];
                element.isotopes.push(isotope);
              }

              if(i===max){
                periodicTable[element.Z]=element; 
              }

              if(i===max && element.Z ===118) {
                console.log('------PERIODIC TABLE-------'+JSON.stringify(periodicTable, null, 2));
                fs.writeFile('isotopes.txt', JSON.stringify(periodicTable, null, 2), function(err){
                 if(err) throw err;
                 console.log('FILE WRITTEN');
                });
              }
            });
        }
    });
  }
  res.end(202);
});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
