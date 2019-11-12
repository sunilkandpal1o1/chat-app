const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {

	let users;
	beforeEach( () => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'mike',
			room: 'Node Course'
		}, {
			id: '2',
			name: 'any',
			room: 'React Course',
		}, {
			id: '3',
			name: 'many',
			room: 'Node Course'
		}];
	});

	it('should add a user', () => {
		const users = new Users();
		const user = { id: '123', name: 'humau', room: 'xyz' };
		const resUser = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('should get list of users with Node Course', () => {
		let userList = users.getUserList('Node Course');
		expect(userList).toEqual(['mike', 'many']);
	});

	it('should remove a user', () => {
		let userId = '1';
		let user = users.removeUser(userId);

		expect(user.id).toBe(userId);
	});

	it('should not remove a user', () => {
		let userId = '99';
		let user = users.removeUser(userId);

		expect(user).toNotExist();
	});

	it('should get user', () => {
		let userId = '1';
		let user = users.getUser(userId);

		expect(user.id).toBe(userId);
	});

	it('should not get user', () => {
		let userId = '33';
		let user = users.getUser(userId);

		expect(user).toNotExist();
	});
});