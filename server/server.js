const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation.js');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static(publicPath));

const users = new Users();

server.listen(port, ()=>{
    console.log(`Listing on port ${port}`);
});

io.on('connection', ( socket ) => {
	console.log('New user connected');

	socket.on('join', ( param, callback ) => {
		if(!isRealString(param.name) || !isRealString(param.room)) {
			return callback('username or room name in not valid');
		}

		socket.join(param.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, param.name, param.room);
		

		io.to(param.room).emit('updateUserList', users.getUserList(param.room));

		//io.emit -> io.to('room name').emit
		//socket.broadcast.emit -> socket.broadcast.to('room name').emit


		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

		socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin', `${param.name} has joined`));

		callback();
	});


	socket.on('createMessage', ( message, callback ) => {
		console.log('Created message ',message);

		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', ( coords ) => {
		io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User Disconnected');
		const user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
	});
});