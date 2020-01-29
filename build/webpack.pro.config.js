const config = require('./config/config.js')
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
let baseConfig = require('./webpack.base.config.js')
let merge = require('webpack-merge')

function getExports(project){
    let entry = {}
    let plugins = []
    let alias = {}
    config.apps.forEach((app)=>{
        var dirName = ''
        if(config.apps.length>1){
            dirName = `${app}/`
        }
        entry[`${dirName}app`] = path.resolve(__dirname,`${config.mainDir}/${project}/${app}/main.js`)
    })
    let rules = []
    return {
        entry: Object.assign(entry,{}),
        output:{
            path:path.resolve(__dirname,'..',config.dist,project),
            filename:'[name].[chunkHash].bundle.js',
            publicPath: config.build.publicPath
            //publicPath:"dist"//页面上引入的路径 比如js/xxx就会变成dist/js/xxx
        },
        //bund超过一定大小会报警告，加上这个配置就不会报了
        performance: {
            hints:false
        },
        module:{
            rules:rules.concat([
                {
                    test: /\.css$/,
                    //loader:'style-loader!css-loader'
                    //从右到左执行
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,//注意这边
                            options: {
                                publicPath: '../'//解决css下的图片路径错误问题
                            }
                        },
                        {
                            loader: 'css-loader'
                        },
                        {loader: 'postcss-loader'}//配合postcss.config文件来加CSS前缀
                    ],
                    exclude: [path.resolve(__dirname,'..',config.dist)],//排除解析dist文件夹
                    include: [path.resolve(__dirname,`${config.mainDir}`),/node_modules/]//只编译src文件夹
                },
                {
                    test: /\.less/,
                    //loader:'style-loader!css-loader'
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,//注意这边
                            options: {
                                publicPath: '../'//解决css下的图片路径错误问题
                            }
                        },

                        {
                            loader: 'css-loader'
                        },
                        {loader: 'postcss-loader'},//配合postcss.config文件来加CSS前缀
                        {
                            loader: "less-loader"
                        }
                    ],
                    exclude: [path.resolve(__dirname,'..',config.dist)],//排除解析dist文件夹
                    include: [path.resolve(__dirname,`${config.mainDir}`),/node_modules/]//只编译src文件夹
                }
            ])
        },
        optimization: {
            minimizer: [
                new OptimizeCssAssetsPlugin()
            ]
        },
        plugins: plugins.concat([
            //使用内容hash的规则hash文件 便于静态资源缓存
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name]Style/style.css",
                chunkFilename: "[name]Style/style.[hash:8].css"}),
            new WebpackParallelUglifyPlugin({
                uglifyJS: {
                    output: {
                        beautify: false, //不需要格式化
                        comments: false //不保留注释
                    },
                    compress: {
                        // warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                        drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
                        collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                        reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                    }
                }
            })
        ])
    }
}


module.exports = merge(baseConfig,getExports(config.project))