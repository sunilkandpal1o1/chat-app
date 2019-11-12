const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
	it('should reject non-string values', () => {
		const str = 1244;
		expect(isRealString(str)).toBe(false);
	});

	it('should reject string with only spaces', () => {
		const str = '   ';
		expect(isRealString(str)).toBe(false);
	});

	it('should allow string with non space character', () => {
		const str = '   lotr';
		expect(isRealString(str)).toBe(true);
	});
});