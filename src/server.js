const http = require('http');
const Koa = require('koa');
const path = require('path');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const Router = require('koa-router');
const koaStatic = require('koa-static'); 

const { createServer } = require('./api/WebSockets.js');
const {	chekingUser, saveUser, loadUsers, removeUser } = require('./api/users.js');

const app = new Koa();
const router = new Router();
const public = path.join(__dirname, '/public');

app.use(cors());
app.use(koaStatic(public));
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

router.post('/cheking', async (ctx, next) => {
	const data = await chekingUser(ctx.request.body);
	ctx.response.body = {
		success: data,
	}
});

router.post('/registration', async (ctx, next) => {
	const data = await saveUser(ctx.request.body)
	ctx.response.body = data;
});

router.get('/users', async (ctx, next) => {
	const data = await loadUsers(ctx.request.body)
	ctx.response.body = data;
});

app.use(router.routes())
	.use(router.allowedMethods());

const port = process.env.PORT || 10000;
const server = http.createServer(app.callback());

const wsServer = createServer(server)

server.listen(port)




