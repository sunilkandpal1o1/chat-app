const socket = io();

function scrollToBottom() {
	//selectors
	let message = $('#message-area');
	let newMessage = message.children('li:last-child');

	//hieghts
	let clientHeight = message.prop('clientHeight');
	let scrollTop = message.prop('scrollTop');
	let scrollHeight = message.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let prevMessageHeight = newMessage.prev().innerHeight();

	console.log('clientHeight: ',clientHeight);
		console.log('scrollTop: ',scrollTop);
		console.log('scrollHeight: ',scrollHeight);

	if( clientHeight + scrollTop  + newMessageHeight + prevMessageHeight >= scrollHeight ) {
		message.scrollTop(scrollHeight);
	}
}
socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('newMessage', function (message) {

	// rendering using mustache
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = $('#message-template').html();
	let html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formattedTime,
	});

	$('#message-area').append(html);
	scrollToBottom();

	// let li = $('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);

	// $('#message-area').append(li);
});

socket.on('newLocationMessage', function (locationMessage) {

	let formattedTime = moment(locationMessage.createdAt).format('h:mm a');
	let locationTemplate = $('#location-message-template').html();
	let html = Mustache.render(locationTemplate, {
		from: locationMessage.from,
		url: locationMessage.url,
		createAt: formattedTime,
	});
	$('#message-area').append(html);
	scrollToBottom();

	// let li = $('<li></li>');
	// let a = $('<a target="_blank">Here I am</a>');

	// li.text(`${locationMessage.from} ${formattedTime}: `);
	// a.attr('href',locationMessage.url);

	// li.append(a);
	// $('#message-area').append(li);
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