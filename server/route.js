module.exports = (router) => {
    
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

}