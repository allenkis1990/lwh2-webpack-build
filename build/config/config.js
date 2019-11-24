console.log(123);
let argv = require('yargs').argv
let fs = require('fs')
let colors = require('colors/safe');
let deleteDist = require('../task/deleteDist')
let path = require('path')

let config = {
    //mods:'mods',
    mods:'parentMods',
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
    }
}
if(argv.design){
    config.port = config.designPort;
}
if(!argv.devdist){
    deleteDist(config)
}else{
    console.log(2222);
    if(argv.mode==='production'){
        deleteDist(config)
    }
}
module.exports = config