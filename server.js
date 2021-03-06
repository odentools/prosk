
/**
	server
**/

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));

// Basic認証 - e.g. BASIC_AUTH='taro:0123,hanako:4567'
var basicAuth = require('basic-auth-connect'), basicAuthUsers = {};
if (process.env['BASIC_AUTH']) {
	process.env['BASIC_AUTH'].split(/,/).forEach(function (chunk, i) {
		var chunk_ = chunk.split(/:/);
		basicAuthUsers[chunk_[0]] = chunk_[1];
	});
}
app.use(basicAuth(function (req_user, req_pw) {
	return ((Object.keys(basicAuthUsers).length == 0) || (basicAuthUsers[req_user] && basicAuthUsers[req_user] === req_pw));
}));

// bower_components & wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('bower_components'));
app.use(express.static('www'));

server.listen(process.env.PORT || 3000);


var pdeListArray = new Array();
var pdeArray = new Array();

app.get(/^\/(\d+)\/?$/, function (req, res){

	if (!req.url.match(/\/$/)) {
		res.redirect(req.url + '/');
		return;
	}

	var id = req.params[0];
	if (pdeListArray.length <= id || !pdeListArray[id]) {
		res.status(404).send('指定されたIDのリストは存在しません');
		return;
	}

	res.sendFile(__dirname + '/viewer/index.html');
});

app.get(/^\/(\d+)\/pde.html\/?$/, function (req, res){

	var id = req.params[0];
	if (pdeListArray.length <= id || !pdeListArray[id]) {
		res.status(404).send('指定されたIDのリストは存在しません');
		return;
	}

	res.sendFile(__dirname + '/viewer/pde.html');
});


app.get(/^\/(\d+)\/pde\/([A-Z]{2}\d{2}[A-Z]\d{3})\.pde$/, function(req, res){

	try{
		var m = req.url.match(/^\/(\d+)\/pde\/([A-Z]{2}\d{2}[A-Z]\d{3}).pde$/);
		var no = m[1];
		var id = m[2];
		res.send(pdeListArray[no][id].	content);
	}catch(e){
		console.log("error");
		res.send("e");
	}

});

app.get(/^\/pde\/(\d+).pde$/, function(req, res){

	try{
		var m = req.url.match( /^\/pde\/(\d+).pde$/);
		var no = m[1];
		res.send(pdeArray[no].content);
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

	res.writeHead(200, { "Content-Type": "text/plain" });
	res.write(""+(pdeListArray.length-1));
	res.end();
});

app.post('/pdeFile', function(req, res){
	console.log(pdeArray);
	pdeArray.push(req.body);

	res.writeHead(200, { "Content-Type": "text/plain" });
	res.write(""+(pdeArray.length-1));
	res.end();
});
