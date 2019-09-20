const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const next = require('next');
const Redis = require('ioredis');
const sessionStore = require('./server/sessionStore');
const auth = require('./server/auth');
const routeConfig = require('./server/route');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
const redis = new Redis();

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    // 为cookie加密
    server.keys = ['ff8789sb'];
    const SESSION_CONFIG = {
        key: 'key',
        store: new sessionStore(redis)
    };

    server.use(session(SESSION_CONFIG, server));

    auth(server);

    // 使用路由中间件
    routeConfig(router);
    server.use(router.routes());

    // 默认中间件
    server.use(async(ctx, next) => {
        // console.log('session is ', ctx.session);
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.listen(3000, () => {
        console.log('koa server listening on 3000');
    });
});