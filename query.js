var fs = require('fs');
//Require the Neo4J module
var neo4j = require('node-neo4j');

//Create a db object. We will using this object to work on the DB.
db = new neo4j('http://neo4j:ayanami00@localhost:7474');

// String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

// //reconstruct graph
// var users = fs.readFileSync('users.txt','utf-8');

// var data = users.split('[');
// var users = {};

// var nodes = [];

// for(var i=1; i<data.length; i++){
//    var chunk = data[i].split(',');
//    var end = chunk[1].indexOf(']');
//    var name = chunk[1].slice(1,end-1);

//    users[name]=parseInt(chunk[0]);
//    var node = {id:chunk[0],name:name};
//    nodes.push(node);
// };

// //reconstruct graph
// var edgedata = fs.readFileSync('edges.txt','utf-8');

// var edgedata = JSON.stringify(edgedata).split('],');

// // console.log(edgedata);
// var edges = [];

// for(var i=1; i<edgedata.length; i++){
//    var chunk = edgedata[i].split(',');
//    var source = chunk[0].slice(1);
//    var target = chunk[1];
//    console.log('CHUNK: '+chunk);
//    console.log('SOURCE: '+source + ' TARGET: '+target);
//    console.log(typeof target);

//    if(!source.contains('null')){
//     var edge = {source:parseInt(source), target:parseInt(target)};
//     console.log('EDGE:'+edge);
//     edges.push(edge);
//    }
// };

// var allGraph = {nodes:nodes, edges:edges};
// fs.writeFileSync('data.json', JSON.stringify(allGraph));

//find rootid
var rootid = graph['tkersey'];
//query
db.readRelationshipsOfNode(rootid, {
    types: ['_'] ,// optional
    direction: 'all' // optional, alternative 'out', defaults to 'all'
    }, function(err, relationships) {
        if (err) throw err;

    console.log('RELATIONSHIPS OF '+rootid+' : ');
    console.log(relationships); // delivers an array of relationship objects.
});

// db.readRelationshipTypes(function(err, result){
//     if(err) throw err;

//     console.log('ALL RELATIONSHIP TYPES: '+result); // eg. ['RELATED_TO', 'LOVES', 'KNOWNS']
// });

