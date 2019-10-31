const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
	it('should generate a correct message', () => {
		const from = 'sunil';
		const text = 'testing';
		const message = generateMessage(from, text);

		expect(message).toInclude({
			from,
			text,
		});

		expect(message.createdAt).toBeA('number');
	});
});

describe('generateLocationMessage', () => {
	it('should generate a corrent location message', () => {
		const from = 'mario';
		const latitude = 14;
		const longitude = 19;
		const url = `http://www.google.com/maps?q=${latitude},${longitude}`;

		const locationMessage = generateLocationMessage(from, latitude, longitude);

		expect(locationMessage.createdAt).toBeA('number');
		expect(locationMessage).toInclude({from, url});
	});
});