const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const port = 8080;

app.use(express.static(__dirname));

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/ui/index.html');
});

app.get('/scripts/main.js', function(req, res,next) {  
    res.sendFile(__dirname + '/scripts/main.js');
});

app.get('/css/style.css', function(req, res,next) {  
    res.sendFile(__dirname + '/css/style.css');
});

server.listen(port, () => {
	console.log('app is listening to ' + port);
});  


io.on('connection', function(client) {  
    client.on('playerConnect', () => {
    	console.log('New Player Connected!');
    });
});