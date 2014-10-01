var jade = require('jade');

var express = require('express'),http = require('http'); //app = express.createServer();
var app = express();
//var app = http.createServer(exp);


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
//app.configure(function() {
    app.use(express.static(__dirname + '/public'));
//});


app.get('/', function(req, res){
  res.render('home.jade');
});


var crtSrv = http.createServer(app);
crtSrv.listen(3000, function(){
  console.log('listening on *:3000');
});
var io = require('socket.io').listen(crtSrv);


io.sockets.on('connection', function (socket) {
    //our other events...
    socket.on('setPseudo', function (data) {
    	socket.pseudo =  data;
    	console.log("Pseudo::"+data)
	});
	
	socket.on('message', function (message) {
		var name = socket.pseudo;
        var data = { 'message' : message, pseudo : name };
        socket.broadcast.emit('message', data);
        console.log("user " + name + " send this : " + message);
	});
});

