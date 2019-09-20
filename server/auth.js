const axios = require('axios');
const clientConfig = require('../lib/clientConfig');

const {accessTokenUrl, clientID, clientSecret} = clientConfig.github;

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
                console.log(result.data);
                ctx.session.githubAuth = result.data;
                ctx.redirect('/');
            }else{
                console.log(result.message);
                ctx.body = result.message;
            }

        }else{
            await next();
        }
    });
}