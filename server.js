/**
	server
**/
var express = require('express');
var app = express();
var server = require('http').Server(app);

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));
server.listen(process.env.PORT || 3000);