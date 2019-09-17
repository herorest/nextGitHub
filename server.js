const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    // 反向映射
    router.get('/author/:id', async (ctx) => {
        const id = ctx.params.id;
        await handle(ctx.req, ctx.res, {
            pathname: '/author',
            query: {id}
        });
        ctx.respond = false;
    });

    // 使用路由中间件
    server.use(router.routes());

    // 默认中间件
    server.use(async(ctx, next) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.listen(3000, () => {
        console.log('koa server listening on 3000');
    });
});