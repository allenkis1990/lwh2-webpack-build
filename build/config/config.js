
let argv = require('yargs').argv
let fs = require('fs')
let colors = require('colors/safe');
let path = require('path')

let config = {
    mods:'mods',
    //mods:'parentMods',
    parentMods:'parentMods',
    packageDirName:'@liuweiheng19906666',
    isDesign:argv.design,
    mainDir:!argv.design?'../src':'../design',
    project:'project',
    dist:'dist',
    port:'9900',
    designPort:'8181',
    apps:['portal','center'],
    host:'127.0.0.1',
    dev:{
        publicPath:'/'
    },
    build:{
        publicPath:'/'
    },
    proxyList:{
        '/actions': {
            target: 'http://192.168.28.248:8080/'
            // changeOrigin: false
        },
        '/socket.io': {
            target: 'http://192.168.28.248:8080/'
            // changeOrigin: false
        }
    }
}
if(argv.design){
    config.port = config.designPort;
}
module.exports = config