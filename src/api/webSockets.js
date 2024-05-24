const WS = require('ws');
const path = require('path');
const fs = require('fs/promises');
const uuid = require('uuid');

const { readUsers, writeUsers, writeMessage } = require('./database.js');

const createServer = (server) => {
  const wsServer = new WS.Server ({ server });
  const sendMess = (mess) => {
    [...wsServer.clients]
      .filter(item => item.readyState === WS.OPEN)
      .forEach(item => item.send(mess));  
    }

  wsServer.on('connection', async (ws, req) => {  

    const welcomeMess = await byConnection(req.url)
    sendMess(welcomeMess);

    ws.on('message', async (mess) => {
      const message = await createMess(mess);
      sendMess(message)
    });

    ws.on('error', (err) => {
      console.log(err);
    });

    ws.on('close', async () => {
      const byeMess = await byDisconnect(req.url);
      sendMess(byeMess);
    });
  });
  return wsServer;
}

const byConnection = async (url) => {
  const idUser = getIdFromUrl(url);
  if(!idUser) {
    return;
  }

  const user = await findUserById(idUser);
  if(!user) {
    return;
  }

  const mess = {
    type: 'connect',
    data: user,
    id: uuid.v4(),
  }
  const messJSON = JSON.stringify(mess);
  await writeMessage(messJSON);
  
  return messJSON;
}

const byDisconnect = async (url) => {
  const idUser = getIdFromUrl(url)
  if(!idUser) {
    return;
  }
 
  const removedUser = await removeUser(idUser);

  if(!removedUser) {
    return;
  }

  const mess = {
    type: 'disconnect',
    data: removedUser,
    id: uuid.v4(),
  } 
  const messJSON = JSON.stringify(mess);
  await writeMessage(messJSON);

  return messJSON;
}

const createMess = async (mess) => {  
  const messageJSON = mess.toString() || null;
  const message = JSON.parse(messageJSON); 
  
  const newMess = {
    type: 'message',
    data: message,
    id: uuid.v4(),
  }

  fullMess = JSON.stringify(newMess);
  await writeMessage(fullMess)
  
  return fullMess;
}

const removeUser = async (idUser) => {
  const users = await readUsers();
  const user = users.find(item => item.id === idUser) || null;

  if(!user) {
    return false;
  }

  const index = users.indexOf(user);
  users.splice(index, 1);

  await writeUsers(users)

  return user;
}


const getIdFromUrl = (url) => {
  const newArray = url.split('/');
  const length = newArray.length;
  const id = newArray[length - 1] || null;

  return id;
}

const findUserById = async (id) => {
  const users = await readUsers()
  const user = users.find(item => item.id === id) || null;

  return user;
} 



module.exports = {
	createServer
}
    
