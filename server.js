
/**
	server
**/

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
 
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));
server.listen(process.env.PORT || 3000);


var pdeListArray = new Array();

app.get(/(\d+)\/pde\/([A-Z]{2}\d{2}[A-Z]\d{3})\.pde/, function(req, res){

	try{
		var m = req.url.match(/(\d+)\/pde\/([A-Z]{2}\d{2}[A-Z]\d{3}).pde/);
		var no = m[1];
		var id = m[2];
		res.send(pdeListArray[no][id].content);
	}catch(e){
		console.log("error");
		res.send("e");
	}
	
	
});

app.get(/(\d+)\/studentList.js/, function(req, res){
	try{
		var m = req.url.match(/(\d+)\/studentList.js/);
		var no = m[1];
		
		var studentList = new Array();
		for ( var id in pdeListArray[no] ) {
		
			studentList.push({ id:pdeListArray[no][id]["userId"],name:pdeListArray[no][id]["userName"]});
		}
		
		res.send("var studentList = " + JSON.stringify(studentList) + ";")
	
	}catch(e){
		console.log("error");
		res.send("e");
	}

});

app.post('/pdeList', function(req, res){

	pdeListArray.push(req.body);
	
	app.use('/'+(pdeListArray.length-1),express.static('viewer'));
	
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.write(""+(pdeListArray.length-1));
	res.end();

});