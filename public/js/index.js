const socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {
	console.log('New message ', message);
	let li = $('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	$('#message-area').append(li);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val(),
	}, function () {

	});
});