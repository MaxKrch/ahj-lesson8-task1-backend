const fs = require('fs/promises');
const path = require('path');
const usersList = path.join(__dirname, '../data/users.json');
const messageList = path.join(__dirname, '../data/messages.json');

const writeMessage = async (message) => {
	const mess = JSON.parse(message);
	mess.time = new Date
	const fullMess = JSON.stringify(mess)
	await fs.appendFile(messageList, fullMess)
}

const readUsers = async () => {
	const usersJSON = await fs.readFile(usersList, 'utf8');
	const users = usersJSON ? JSON.parse(usersJSON) : [];

	return users;
}

const writeUsers = async (users) => {
	const usersJSON = JSON.stringify(users);
	
	await fs.writeFile(usersList, usersJSON);
	
	return true;
}


module.exports = {
	writeMessage,
	readUsers,
	writeUsers
}