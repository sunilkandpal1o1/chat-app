const socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {

	let formattedTime = moment(message.createdAt).format('h:mm a');
	let li = $('<li></li>');
	li.text(`${message.from} ${formattedTime}: ${message.text}`);

	$('#message-area').append(li);
});

socket.on('newLocationMessage', function (locationMessage) {

	let formattedTime = moment(locationMessage.createdAt).format('h:mm a');
	let li = $('<li></li>');
	let a = $('<a target="_blank">Here I am</a>');

	li.text(`${locationMessage.from} ${formattedTime}: `);
	a.attr('href',locationMessage.url);

	li.append(a);
	$('#message-area').append(li);
})

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	let messageBox = $('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		text: messageBox.val(),
	}, function () {
		messageBox.val('');
	});
});

let locationButton = $('#send-location');
locationButton.on('click', function () {
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled','disable');
	navigator.geolocation.getCurrentPosition( function ( position ) {
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		});

		locationButton.removeAttr('disabled');

	}, function () {
		locationButton.removeAttr('disabled');
		alert('Unable to get location');
	});
});