const express = require('express');
const app = express();

app.use(express.static('src/public'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`App is running in the port ${port}`);
});

const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connection', (socket) => {
	socket.on('track', (data) => {
		socket.broadcast.emit('track', data);
	});
});