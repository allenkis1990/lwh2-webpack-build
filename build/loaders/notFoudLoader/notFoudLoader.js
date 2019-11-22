module.exports = loader
var path = require('path')
var buildAll = require('yargs').argv.all
var loaderUtils = require('loader-utils')
var fs = require('fs')
function findCurrentWebpackConfig(configArr,project){
    var currentWebpackConfig = configArr.find((config)=>{
        return config.output.path.includes(project)
    })
    return currentWebpackConfig
}

function loader(source){
    // console.log(this.resourcePath,88888888888888);
    var options = loaderUtils.getOptions(this)
    var moduleMatchs = []
    //匹配require('xxx')
    var requireMatchs = source.match(/require\s*?\(.*?\)/g) || []


    //匹配import xxx from 'xxx'
    var importMatchs = source.match(/import.*?from.*?('|").*?('|")/g) || []


    //匹配import(/* webpackChunkName: "portal/chunk/test3" */'@portal/views/test3/test3.vue')
    //或者import('@portal/views/test3/test3.vue')
    var importAsyncMatchs = source.match(/import.*?\((\/\*.*?\*\/)?.*?['"].*?['"].*?\)/g) || []


    //匹配@import 'xxx'
    var importStyleMatchs = source.match(/@import.*?['"].*?['"]/g) || []


    //匹配src = 'xxx'
    var srcMatchs = source.match(/src.*?=.*?['"].*?['"]/g) || []


    //匹配url('xxx')
    var bgMatchs = source.match(/url.*?\(.*?['"].*?['"].*?\)/g) || []



    //来自哪个项目从外面传进来
    var project = options.project
    // console.log(project,77);
    // console.log(project);
    if(requireMatchs.length||importMatchs.length||importStyleMatchs.length||srcMatchs.length||bgMatchs.length||importAsyncMatchs.length){
        var alias
        if(!buildAll){
            //非build-all的时候就直接取alias
            alias = require('../../webpack.pro.config.js').resolve.alias
        } else {
            //build-all的时候根据是哪个project来取相应的alias
            var webpackConfigArr = require('../../webpack.buildAll.config.js')
            var currentWebpackConfig = findCurrentWebpackConfig(webpackConfigArr,project)
            // console.log(currentWebpackConfig,3333);
            if(currentWebpackConfig){
                alias = currentWebpackConfig.resolve.alias
                // console.log(alias,12311);
            }
        }
        //console.log(alias);
        moduleMatchs = moduleMatchs.concat(requireMatchs)
        moduleMatchs = moduleMatchs.concat(importMatchs)
        moduleMatchs = moduleMatchs.concat(importStyleMatchs)
        moduleMatchs = moduleMatchs.concat(srcMatchs)
        moduleMatchs = moduleMatchs.concat(bgMatchs)
        moduleMatchs = moduleMatchs.concat(importAsyncMatchs)
        moduleMatchs.forEach((item)=>{
            // console.log(item,'kkk');
            var filePath
            if(/\/\*.*?\*\//.test(item)){
                //import()有带/**/的情况
                filePath = item.match(/['"](.*?)['"]/g)[1].replace(/('|")/g,'')
            } else {
                //import()不带/**/的情况
                filePath = item.match(/['"](.*)['"]/g)[0].replace(/('|")/g,'')
            }
            // console.log(filePath,886);
            var aliasKeys = Object.keys(alias)
            var firstWord = filePath.split('/')[0]
            var aliasKeysIndex
            var parentAliasKey
            if(firstWord.indexOf('~')>-1){
                aliasKeysIndex = aliasKeys.indexOf(firstWord.replace('~',''))
                parentAliasKey = '~@parent'
            } else {
                aliasKeysIndex = aliasKeys.indexOf(firstWord)
                parentAliasKey = '@parent'
            }
            if(aliasKeysIndex>-1){
                var aliasKey = aliasKeys[aliasKeysIndex]
                var aliasKeyPath = alias[aliasKey]
                var path = filePath.replace((firstWord.indexOf('~')>-1?`~${aliasKey}`:aliasKey),'')
                var fullPath = aliasKeyPath + path.replace(/\//g,'\\')
                try{
                    var aa = require.resolve(fullPath)
                    // console.log(aa,'normal');
                }catch (e){
                    // console.log(fullPath,'err')
                    var parentPath = `${parentAliasKey}/${aliasKey.replace('@','')}${path}`
                    //console.log(parentPath);
                    source = source.replace(new RegExp(filePath,'ig'),parentPath)
                    // if(/\/\*.*?\*\//.test(item)){
                    //     console.log(source);
                    // }
                }
                //console.log(fullPath);
            }

            //console.log(aliasKeys.indexOf(filePath.split('/')[0]),'index');
            //var app = filePath.match()
            //try{
            //
            //}catch(e){
            //
            //}
            // console.log(filePath,12);
        })
    }
    //console.log(this.context);
    // console.log(this.resourcePath);
    // console.log(path.sep,12);
    return source
}