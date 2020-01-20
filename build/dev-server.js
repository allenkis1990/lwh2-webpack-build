
const express = require('express')
const app = express()
const webpack  = require('webpack')
let webpackConfig = require('./webpack.dev.config')
// webpackConfig.mode = 'development'
webpackConfig.mode = 'development'
let config = require('./config/config')
Object.keys(webpackConfig.entry).forEach(function (name) {
    // console.log(name);
    //if (name !== 'index') {
    //    webpackConfig.entry[name] = ['./dev-client'].concat(webpackConfig.entry[name])
    //}
})
var compiler = webpack(webpackConfig)

//////////////////////热更新////////////////////////////
// 开发环境下加自动刷新的entry
// index.html无法热更新
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {},
    path: "/__webpack_hmr"
    // heartbeat: 20000
})

app.use(hotMiddleware);
//////////////////////热更新////////////////////////////
//////////////////////开发服务器配置////////////////////////////
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.dev.publicPath,
    // publicPath: 'http://127.0.0.1:8080/portal',
    quiet: true,
    noInfo: true,
    // writeToDisk:true
})

//开发环境url访问/的时候固定重定向到portal去
app.get('/',function(req,res){
    res.redirect('/portal');
})



//纠正VUE history模式下刷新404问题
let historyFallback = require('./task/historyFallback.js')
historyFallback(app)
app.use(devMiddleware);
//////////////////////开发服务器配置////////////////////////////


//////////////////////代理////////////////////////////
const proxyMiddleware = require('http-proxy-middleware')
Object.keys(config.proxyList).forEach(function (context) {
    var options = config.proxyList[context]
    if (typeof options === 'string') {
        options = {target: options}
    }
    app.use(proxyMiddleware(context, options))
})
//////////////////////代理////////////////////////////

app.listen(config.port,config.host);
