const axios = require('axios');
const clientConfig = require('../lib/clientConfig');

const {accessTokenUrl, userInfo, clientID, clientSecret} = clientConfig.github;

module.exports = (server) => {
    server.use(async (ctx, next) => {
        
        // path 带 /
        // 客户端根据client_id跳转授权页面后，返回code到页面上
        if(ctx.path === '/auth'){
            const code = ctx.query.code;
            if(!code){
                ctx.body = 'code not exist';
                return;
            }

            // 服务端根据code请求授权的token
            const result = await axios({
                method: 'POST',
                url: accessTokenUrl,
                data: {
                    client_id: clientID,
                    client_secret: clientSecret,
                    code
                },
                headers: {
                    Accept: 'application/json'
                }
            });

            if(result.status === 200 && result.data && !(result.data.error)){
                const {access_token, token_type} = result.data;
                ctx.session.githubAuth = result.data;
                const userRes = await axios({
                    method: 'GET',
                    url: userInfo,
                    headers: {
                        Authorization: `${token_type} ${access_token}`
                    }
                }); 
                ctx.session.userInfo = userRes.data;
                if(ctx.session && ctx.session.urlBeforeOAuth){
                    console.log('---', ctx.session.urlBeforeOAuth);
                    ctx.redirect(ctx.session.urlBeforeOAuth);
                    ctx.session.urlBeforeOAuth = '';
                }else{
                    ctx.redirect('/');
                }
               

            }else{
                console.log(result.message);
                ctx.body = result.message;
            }

        }else{
            await next();
        }
    });


    // 退出
    server.use(async (ctx, next) => {
        if(ctx.path === '/logout' && ctx.method === 'POST'){
            console.log('用户退出');
            ctx.session = null;
            ctx.body = '退出成功'
        }else{
            await next();
        }
    });

    // 记录登录前的页面地址
    server.use(async (ctx, next) => {
        if(ctx.path === '/prepare-auth' && ctx.method === 'GET'){
            const {url} = ctx.query;
            ctx.session.urlBeforeOAuth = url;
            console.log('记录成功', url);
            ctx.body = '记录成功';
        }else{
            await next();
        }
    });
}