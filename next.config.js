// 让 nextjs 支持引入css
const withCss = require('@zeit/next-css');

if(typeof require !== 'undefined'){
    require.extensions['.css'] = file => {}
}

module.exports = withCss({
    distDir: 'dist',
    webpack(config){
        return config;
    },
    env: {
        entry: 'default'
    },
    serverRuntimeConfig: {
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET
    },
    publicRuntimeConfig: {
        staticFolder: '/static'
    }
});