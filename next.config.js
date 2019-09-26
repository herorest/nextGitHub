// 让 nextjs 支持引入css
const withCss = require('@zeit/next-css');
const webpack = require('webpack');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const clientConfig = require('./lib/clientConfig');

if(typeof require !== 'undefined'){
    require.extensions['.css'] = file => {}
}

module.exports = withBundleAnalyzer(withCss({
    distDir: 'dist',
    webpack(config){
        //忽略moment中的多语言
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
        return config;
    },
    env: {
        entry: 'default',
    },
    serverRuntimeConfig: {
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET
    },
    publicRuntimeConfig: {
        staticFolder: '/static',
        githubOauthUrl: clientConfig.github.authUrl,
        oAuthUrl: `${clientConfig.github.authUrl}?client_id=${clientConfig.github.clientID}&scope=${'user'}`
    },
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html'
        },
    }
}));