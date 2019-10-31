const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(`Listing on port ${port}`);
});

io.on('connection', ( socket ) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', ( message ) => {
		console.log('Created message ',message);

		io.emit('newMessage', generateMessage(message.from, message.text));

		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime(),
		// });
	});

	socket.on('disconnect', () => {
		console.log('User Disconnected');
	});
});