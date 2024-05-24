const { readUsers, writeUsers } = require('./database.js');
const uuid = require('uuid');
const avaLink = ('/img/avatars/avatar.png')

const chekingUser = async (user) => {
	const users = await readUsers();
	const chek = users.findIndex(item => item.nick === user.nick)
	if(chek === -1) {
		return true;
	}
	return false;
}

const saveUser = async (user) => {
	const nick = user.nick;
	const id = uuid.v4();
	const newUser = {
		nick,
		id,
		avaLink
	}
	
	const resp = {
		success: false,
	}

	try {
		const users = await readUsers();
		users.push(newUser);
		await writeUsers(users);

		resp.success = true;
		resp.user = newUser;
	
	} catch (err) {
		console.log(err);
	} finally {
		return resp;
	}
}

const loadUsers = async () => {
	const resp = {
		success: false,
	}

	try {
		const users = await readUsers();
		resp.success = true;
		resp.users = users;
	
	} catch (err) {
		console.log(err);
	} finally {
		return resp;
	}
}
const removeUser = () => {

}



module.exports = {
	chekingUser,
	saveUser,
	loadUsers,
	removeUser
}