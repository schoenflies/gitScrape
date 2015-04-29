//Require the Neo4J module
var neo4j = require('node-neo4j');
var fs = require('fs');

//Create a db object. We will using this object to work on the DB.
db = new neo4j('http://neo4j:ayanami00@localhost:7474');

//reconstruct graph
var graph = fs.readFileSync('users.txt','utf-8');

var data = graph.split('[');
var graph = {};

var edges = [];

for(var i=1; i<data.length; i++){
   var chunk = data[i].split(',');
   var end = chunk[1].indexOf(']');
   var name = chunk[1].slice(1,end-1);

   graph[name]=parseInt(chunk[0]);
};

for(var key in graph){
		//read node
		var rootid = graph[key];
		db.readNode(rootid, function(err, node){
		    if(err) throw err;

		    for(var i=0; i<node.following.length; i++){
		    	var follower = node.following[i];
		    	//find follower id
		    	var followerid = graph[follower];
		        
		        // console.log('follower: '+follower + ' id: '+ followerid);

		        if(followerid){
				// update relationships
					db.insertRelationship(rootid, followerid, '_', {following: 'on github'},function(err, relationship){   
				        if(err) throw err;

				        //confirm relationship
				        db.readRelationship(relationship._id, function(err, relationship){
	    					if(err) throw err;
	    					console.log('relationship confirmed between '+relationship._start+' and '+relationship._end);
						});

						//add edge to edges
						var edge = [followerid, rootid];
						fs.appendFile('edges.txt',JSON.stringify(edge)+',',function(err,results){
              				if (err) throw err;
            			})
					});//end dbinsert
			    }//end if follower exists
		    }//end following loop

		});
	}//END GRAPH ITERATION

// exports = module.exports = db;
