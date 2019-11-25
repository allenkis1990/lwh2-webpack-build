const config = require('./config/config.js')
let deleteDist = require('./task/deleteDist')
deleteDist()
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');//构建进度条插件
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const Happypack = require('happypack')
const AddFavIcoPlugin = require('./plugins/addFavIcoPlugin.js')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
let argv = require('yargs').argv

function getExports(project){
    let entry = {}
    let cacheGroups = {}
    let plugins = []
    let alias = {}
    alias[`@mods`] = path.resolve(__dirname,`${config.mainDir}/${config.mods}`)
    alias[`@parentMods`] = path.resolve(__dirname,`${config.mainDir}/${config.parentMods}`)
    config.apps.forEach((app)=>{
        var dirName = ''
        if(config.apps.length>1){
            dirName = `${app}/`
        }
        entry[`${dirName}app`] = path.resolve(__dirname,`${config.mainDir}/${project}/${app}/main.js`)
        cacheGroups[`${app}Assets`] = {
            chunks: 'initial',// 只对入口文件处理
            test: path.resolve(__dirname,`${config.mainDir}/${project}/${app}/assets`),
            // test: /assets/,
            name: `${dirName}assets`,
            priority: 10,
            enforce: true,
            minChunks:1//最小被引用两次的公共库才被抽离到公共代码
        }
        //'@':path.resolve(`${config.mainDir}/${project}`)
        alias[`@${app}`] = path.resolve(__dirname,`${config.mainDir}/${project}/${app}`)
        plugins.push(new HtmlWebpackPlugin({
            filename: `${dirName}index.html`,//真正输出的地址output.path+filename=./dist/index.html
            template:path.resolve(__dirname,`${config.mainDir}/${project}/${app}/index.html`),//INdex的模板
            inject: true,
            hash:true,
            title:app,
            minify: {
                removeAttributeQuotes: true, // 移除属性的引号
                collapseWhitespace:true,//html片段变成一行
                removeComments: true
            },
            excludeChunks: config.apps.filter((item)=> {
                return item !== app
            }).map((item)=>{
                return `${item}/app`
            }),
            chunks:[`${dirName}app`]//按需映入入口JS
        }))
    })
    let rules = []
    config.apps.forEach((app)=>{
        var dirName = ''
        if(config.apps.length>1){
            dirName = `${app}/`
        }
        let reg  = new RegExp(`${app}\\\\images\\\\.+\\.(gif|png|jpg|svg|ttf|woff|mp4|swf)`)
        rules.push(
            {
                test:reg,
                use:{
                    loader:'url-loader',
                    options: {
                        // outputPath:`/${app}/images`,
                        publicPath:'/',
                        name:`${dirName}images/[name].[hash:8].[ext]`,
                        limit:1024*1//小于8KB会被转成base64
                    }
                },
                exclude:[path.resolve(__dirname,'..',config.dist),/node_modules/]//排除解析dist文件夹
                //include:[path.resolve('./projects/project1/src')]//只编译src文件夹 但是node_modules除外
            }
        )
    })

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
        externals: {
            // 使用动态连接库的VUE模块，这样就可以直接在项目中require('Vue')使用 webpack不会进行打包
            //'Vue': 'window._dll_vueAll(\'./node_modules/vue/dist/vue.min.js\')'
        },
        resolve: {
            //import时可以省去后缀名js vue json默认require先找.js从左到右
            //作用于项目中，webpack配置文件中无法使用
            extensions: ['.js', '.vue', '.json','.less'],
            //require('xxx')先去src目录下找没有才去node_modules从左到右
            //作用于项目中，webpack配置文件中无法使用
            // path.resolve(config.parentMainDir)
            modules: [path.resolve(__dirname,'..',"node_modules")/*path.resolve(`${config.mainDir}/${project}`)*/],
            //原本在文件夹里去找package.json只会找main和module现在fuck和shit也会去找优先级从左到右
            mainFields:['main','module','fuck','shit'], 
            //给引入的模块取个别名可以是文件全路径也可以是文件夹
            alias:Object.assign(alias,{
                'vue$': 'vue/dist/vue.esm.js',
                'nms':path.resolve(__dirname,'..','node_modules')
            })
        },
        resolveLoader: {
            // alias: {
            //     testLoader:path.resolve('./loaders/testLoader.js')
            // },
            mainFields:['main'],
            modules: [path.resolve(__dirname,'..',"node_modules"),path.resolve(__dirname,"loaders")]
        },
        module:{
            //不去解析的文件
            // noParse: [/lwh\.js/],
            rules:rules.concat([

                {
                    test: /\.vue$/,
                    use: {
                        loader:'vue-loader'
                    }
                },
                {
                    test:/\.(js|vue)$/,
                    use:{
                        loader:'notFoudLoader',
                        options:{
                            mainDir:config.mainDir.replace('../',''),
                            project:project
                        }
                    },
                    exclude:[path.resolve(__dirname,'..',`${config.dist}`),/node_modules/],
                    include:[path.resolve(__dirname,`${config.mainDir}`)]
                },
                //解析html页面上的img标签 但是htmlWebpackPlugin.options.title无法读取 可用express静态资源解决
                {
                    test:/\.(html|htm)/,
                    loader:'html-withimg-loader'
                },
                // env（替代es2015那些），stage-0，transform-runtime垫片
                {
                    test:/\.js/,
                    use: ['happypack/loader?id=babel'],
                    // 不设置这个会报错
                    exclude: /node_modules/
                },
                {
                    //ttf和woff全部都转成base64
                    test:/node_modules\\.+\.(ttf|woff)/,
                    use:{
                        loader:'url-loader',
                        options: {
                            // outputPath:`${app}/images`,
                            publicPath:'/',
                            limit:1024*1000000//小于8KB会被转成base64
                        }
                    },
                    exclude:[path.resolve(__dirname,'..',`${config.dist}`)]//排除解析dist文件夹
                    //include:[path.resolve('./projects/project1/src')]//只编译src文件夹 但是node_modules除外
                },
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
                    exclude: [path.resolve(__dirname,'..',config.dist), /node_modules/],//排除解析dist文件夹
                    include: [path.resolve(__dirname,`${config.mainDir}`)]//只编译src文件夹 但是node_modules除外
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
                    exclude: [path.resolve(__dirname,'..',config.dist), /node_modules/],//排除解析dist文件夹
                    include: [path.resolve(__dirname,`${config.mainDir}`)]//只编译src文件夹 但是node_modules除外
                },

                //解析打包json文件
                {
                    test:/\.json/i,
                    type: 'javascript/auto',
                    loader:'json-loader'
                }
            ])
        },
        optimization: {
            splitChunks: {
                cacheGroups:Object.assign(cacheGroups,{
                    vendor: {
                        chunks: 'initial',// 只对入口文件处理
                        test:/[\\/]node_modules[\\/]/,
                        name: 'common/vendor',
                        priority: 10,
                        enforce: true,
                        // minChunks:1//最小被引用两次的公共库才被抽离到公共代码
                    }
                })
            },
            //抽取webpack运行文件代码
            runtimeChunk: {
                name: 'common/manifest'
            },
            minimizer: [
                new OptimizeCssAssetsPlugin()
            ]
        },
        plugins: plugins.concat([
            /*new copyWebpackPlugin([
                {from:path.resolve(__dirname,`${config.mainDir}/${config.project}/portal/static`),to:path.resolve(__dirname,`./dist/${config.project}/portal/static`)}
            ])*/
            new VueLoaderPlugin(),
            //在这边配置全局引入后哪个模块不用require都可以用
            new webpack.ProvidePlugin({
                // $:path.resolve(__dirname,`${config.mainDir}/${project}/portal/assets/jquery-1.11.1.min.js`)
            }),
            new CleanWebpackPlugin([path.resolve(__dirname,'..',config.dist,project)]),//删除文件夹插件
            //清除没用到的样式，只有在抽离css的模式生效,指定的是模板html文件
            /*new PurifyCSSPlugin({
                // Give paths to parse for rules. These should be absolute!
                paths: glob.sync(path.join(__dirname, './!*.html')),
            }),*/
            //new uglifyjsWebpackPlugin(),//webpack4会对JS进行自动压缩
            //指定html位置指定后打包的js会自动被引入
            new ProgressBarPlugin(),
            new webpack.DefinePlugin({
                dev:argv.devdist?true:false,
                isHistoryModel:false
            }),
            //使用内容hash的规则hash文件 便于静态资源缓存
            new webpack.HashedModuleIdsPlugin(),
            new Happypack({
                //ID是标识符的意思，ID用来代理当前的happypack是用来处理一类特定的文件的
                id: 'babel',
                use:[{
                    loader:'babel-loader',
                    query:{
                        presets:['env','stage-0','react'],//把es6 es7转成es语法
                        plugins: [
                            [
                                'transform-runtime',
                                {
                                    corejs: true,
                                    helpers: true,
                                    regenerator: true,
                                    useESModules: true,
                                    moduleName: 'babel-runtime'
                                },
                                "component",
                                {
                                    "libraryName": "element-ui",
                                    "styleLibraryName": "theme-chalk"
                                }
                            ]
                        ]
                    }
                }],
                threads: 3,//你要开启多少个子进程去处理这一类型的文件
                verbose: true//是否要输出详细的日志 verbose
            }),
            new MiniCssExtractPlugin({
                filename: "[name]Style/style.css",
                chunkFilename: "[name]Style/style.[hash:8].css"}),
            new AddFavIcoPlugin(),
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


module.exports = getExports(config.project)