/**
 * 处理github数据请求服务端代理，免于在前端直接暴露token等，且可以走登录后请求，这样ratelimit比较大
 */
const api = require('../lib/requestApi');

module.exports = (server) => {
    server.use(async (ctx, next) => {
        const path = ctx.path;
        const method = ctx.method;
        if(path.startsWith('/github/')){
            const result = await api.request({method, url: ctx.url.replace('/github/', '/'), data: ctx.request.body || {}}, ctx);
            ctx.status = result.status;
            if(result.status === 200){
                ctx.body = result.data;
            }else{
                ctx.body = {
                    success: false
                };
            }
            ctx.set('Content-type', 'application/json');
        }else{
            await next();
        }
    });
}