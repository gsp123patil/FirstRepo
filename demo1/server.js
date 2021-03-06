var http = require('http');
var count = 0;
var clients = [];
var server = http.createServer(function(request, response) {
	console.log("Server created");
});
	var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
	var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

server.listen(port,ip_address, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});


var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(r){
    // Code here to run on connection
	
	var connection = r.accept('echo-protocol', r.origin);
	// count = 0;
		
	// Specific id for this client & increment count
	var id = count++;
	console.log(id);
	// Store the connection method so we can loop through & contact all clients
	clients[id] = connection;

	console.log(connection.remoteAddress+' Connection accepted [' + id + ']  ---Clients:'+ clients.length);

	
// Create event listener for message
	connection.on('message', function(message) {
    // The string message that was sent to us
    var msgString = message.utf8Data;
	console.log("_________________"+msgString+"---------------clients length:"+clients.length);
    // Loop through all clients
    for(var m in clients){
	console.log(m+"....");
	//for(var i = 0; i < clients.length; i++ ){
        // Send a message to the client with the message
		//console.log("0000000000=------" + m);
        clients[m].sendUTF(msgString);
		//console.log("1111111111");
    }	
	
	

	});
	
	
// Create event listener for closing connection 	
	connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});

	
});

