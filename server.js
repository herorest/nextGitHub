const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const next = require('next');
const Redis = require('ioredis');
const sessionStore = require('./server/session-store');

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

    server.use(async(ctx, next) => {
        await next();
    });

    // 反向映射
    router.get('/author/:id', async (ctx) => {
        const id = ctx.params.id;
        await handle(ctx.req, ctx.res, {
            pathname: '/author',
            query: {id}
        });

        // 把body的内容交由代码处理，koa不再自行处理
        ctx.respond = false;
    });

    // 设置用户信息
    router.get('/set/user', async (ctx) => {
        
        ctx.session.user = {
            name: 'user',
            age: 18
        }

        ctx.body = 'set session success';
    });

    router.get('/clear/user', async (ctx) => {
        ctx.session = null;
        ctx.body = 'clear session success';
    });

    // 使用路由中间件
    server.use(router.routes());

    // 默认中间件
    server.use(async(ctx, next) => {
        console.log('session is ', ctx.session);
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.listen(3000, () => {
        console.log('koa server listening on 3000');
    });
});