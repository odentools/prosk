/**
	server
**/
var express = require('express');
var app = express();

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));

var server = app.listen(8080);