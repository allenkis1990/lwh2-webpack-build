const config = require('./config/config.js')
let deleteDist = require('./task/deleteDist')
deleteDist()
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
let baseConfig = require('./webpack.base.config.js')
let merge = require('webpack-merge')
function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}
function getExports(project){

    let entry = {}
    let cacheGroups = {}
    let plugins = []
    let alias = {}
    let rules = []
    config.apps.forEach((app)=>{
        entry[`${app}/app`] = [path.resolve(__dirname,`${config.mainDir}/${project}/${app}/main.js`),path.resolve(__dirname,'dev-client.js')]
    })
    return {
        entry: Object.assign(entry,{}),
        output:{
            path:path.resolve(__dirname,'..',config.dist,project),
            filename:'[name].bundle.js',
            //filename:'js/[name].[hash:8].bundle.js',
            // publicPath: 'http://127.0.0.1:8080/'+which+'/'
            // publicPath: which+'/'
            publicPath:config.dev.publicPath//页面上引入的路径 比如js/xxx就会变成dist/js/xxx
        },
        module:{
            rules:rules.concat([
                {
                    test: /\.less/,
                    //loader:'style-loader!css-loader'
                    use: [
                        {
                            //loader: 'style-loader'
                            loader: 'vue-style-loader'
                        },

                        {
                            loader: 'css-loader'
                        },
                        {loader: 'postcss-loader'},//配合postcss.config文件来加CSS前缀
                        {
                            loader: "less-loader"
                        }
                    ],
                    exclude: [path.resolve(__dirname,'..',`${config.dist}`)],//排除解析dist文件夹
                    include: [path.resolve(__dirname,`${config.mainDir}`)]//只编译src文件夹 但是node_modules除外
                },
                {
                    test: /\.css$/,
                    //loader:'style-loader!css-loader'
                    //从右到左执行
                    use: [
                        {
                            //loader: 'style-loader'
                            loader: 'vue-style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {loader: 'postcss-loader'}//配合postcss.config文件来加CSS前缀
                    ],
                    exclude: [path.resolve(__dirname,'..',`${config.dist}`)],//排除解析dist文件夹
                    include: [path.resolve(__dirname,`${config.mainDir}`),/node_modules/]//只编译src文件夹 但是node_modules除外
                }
            ])
        },
        devtool:'source-map',//在--mode production模式下也能精准定位报错位置
        watch:false,
        watchOptions: {
            ignored: /node_modules/,
            poll: 1000,//每多少秒询问一次
            aggregateTimeout: 1000//发现改动后多少秒执行打包
        },
        plugins:plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin()
        ])
    }
}


module.exports = merge(baseConfig,getExports(config.project))