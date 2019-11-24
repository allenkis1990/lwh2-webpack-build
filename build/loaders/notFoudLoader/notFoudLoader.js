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
    if(requireMatchs.length||importMatchs.length||importStyleMatchs.length||srcMatchs.length||bgMatchs.length||importAsyncMatchs.length){
        var alias = require('../../webpack.pro.config.js').resolve.alias
        //console.log(alias);
        moduleMatchs = [].concat(requireMatchs,importMatchs,importStyleMatchs,srcMatchs,bgMatchs,importAsyncMatchs)
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
            var aliasKeys = Object.keys(alias).filter((ali)=>{return ali==='@mods'})
            var firstWord = filePath.split('/')[0]
            var aliasKeysIndex
            var parentAliasKey
            if(firstWord.indexOf('~')>-1){
                aliasKeysIndex = aliasKeys.indexOf(firstWord.replace('~',''))
                parentAliasKey = '~@parentMods'
            } else {
                aliasKeysIndex = aliasKeys.indexOf(firstWord)
                parentAliasKey = '@parentMods'
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
                    var parentPath = `${parentAliasKey}/${path}`
                    //console.log(parentPath);
                    source = source.replace(new RegExp(filePath,'ig'),parentPath)
                }
                //console.log(fullPath);
            }
        })
    }
    //console.log(this.context);
    // console.log(this.resourcePath);
    // console.log(path.sep,12);
    return source
}