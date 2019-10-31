const expect = require('expect');

const { generateMessage } = require('./message');

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