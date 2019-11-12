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

const userExists = (username, room) => {
	let exists = false;
	users.users.forEach( (user) => {
		if(user.name.toLowerCase() == username.toLowerCase()
			&& user.room == room.toLowerCase()) {
			exists = true;
		}
	});
	//console.log(exists);

	return exists;
}

server.listen(port, ()=>{
    console.log(`Listing on port ${port}`);
});

io.on('connection', ( socket ) => {
	console.log('New user connected');

	socket.on('join', ( param, callback ) => {
		if(!isRealString(param.name) || !isRealString(param.room)) {
			return callback('username or room name in not valid');
		}

		if(userExists(param.name, param.room)) {
			return callback('username already exists');
		}

		let room = param.room.toLowerCase();

		socket.join(room);
		users.removeUser(socket.id);
		users.addUser(socket.id, param.name, room);
		

		io.to(room).emit('updateUserList', users.getUserList(room));

		//io.emit -> io.to('room name').emit
		//socket.broadcast.emit -> socket.broadcast.to('room name').emit


		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

		socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${param.name} has joined`));

		callback();
	});


	socket.on('createMessage', ( message, callback ) => {
		console.log('Created message ',message);

		let user = users.getUser(socket.id);
		if(user && isRealString(message.text)){
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));			
		}
		callback();
	});

	socket.on('createLocationMessage', ( coords ) => {
		let user = users.getUser(socket.id);
		if(user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));			
		}
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