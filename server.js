/**
	server
**/
var express = require('express');
var app = express();

// www�f�B���N�g����ÓI�t�@�C���f�B���N�g���Ƃ��ēo�^
app.use(express.static('www'));

var server = app.listen(8080);