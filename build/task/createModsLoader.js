/**
 * Created by Allen Liu on 2019/11/24.
 */
let fs = require('fs')
let path = require('path')
let colors = require('colors/safe');
let config = require('../config/config')
var parentModPath = path.resolve(__dirname, '..', '..', `src/${config.parentMods}`)
var srcPath = path.resolve(__dirname, '..', '..', `src/${config.project}`)

createInitAppModLoader().then(function(){

    fs.readdir(parentModPath, function (e, files) {
        if (e) {
            console.log(e);
            return
        }
        var mapper = getMapper(files)
        //console.log(mapper);
        var appsArr = Object.keys(mapper)
        createAppModLoader(appsArr,mapper)
    })

})


//初始化变量全为空的modLoader
function createInitAppModLoader(){
    return new Promise(function(resolve,reject){
        fs.readdir(srcPath,function(e, files){
            if (e) {
                console.log(e);
                reject()
                return
            }
            if(!files.length){
                console.log('apps没建');
                reject()
                return
            }
            var contentArr = []
            contentArr.push('export const Routers = []\r\n')
            contentArr.push('export const Stores = {}\r\n')
            contentArr.push('export const Components = {}\r\n')
            contentArr.push('export default function(Vue){}')
            var content = contentArr.join('')
            files.forEach(function(app,appIdx){
                var modLoaderPath = path.join(srcPath,app,'utils/mod-loader.js')
                fs.writeFileSync(modLoaderPath,content,'utf8')
                if(appIdx===files.length-1){
                    resolve()
                }
            })
        })
    })
}



//创建相应的modLoader
function createAppModLoader(appsArr,mapper){
    appsArr.forEach(function(app){
        var appMods = mapper[app]
        var contentArr = []
        var routerStr = ''
        var storeStr = ''
        var componentStr = ''
        var vueUseStr = ''
        appMods.forEach(function(mod,modIdx){
            //console.log(mod);
            var modName = mod.replace('@','').replace('-','_')
            //console.log(modName);
            contentArr.push(`import {${modName},${modName}Components,${modName}Routers,${modName}Stores} from '@mods/${mod}/index' \r\n`)

            routerStr+=`...${modName}Routers${modIdx===appMods.length-1?'':','}`
            storeStr+=`...${modName}Stores${modIdx===appMods.length-1?'':','}`
            componentStr+=`...${modName}Components${modIdx===appMods.length-1?'':','}`
            vueUseStr += `  Vue.use(${modName})\r\n`
        })
        //console.log(vueUseStr);
        contentArr.push(`export const Routers = [${routerStr}]\r\n`)
        contentArr.push(`export const Stores = {${storeStr}}\r\n`)
        contentArr.push(`export const Components = {${componentStr}}\r\n`)
        contentArr.push(`export default function(Vue){\r\n`)
        contentArr.push(`${vueUseStr}`)
        contentArr.push(`}`)
        var content = contentArr.join('')
        //console.log(content);

        var modLoaderPath = path.join(srcPath,app,'utils/mod-loader.js')
        console.log(modLoaderPath);
        fs.writeFileSync(modLoaderPath,content,'utf8')
        console.log(colors.green(`创建${app}的mod-loader.js成功`))
    })
}




//{portal:[mod1,mod2],center:[mod1]}
function getMapper(files){
    var mapper = {}
    files.forEach(function (file) {
        //console.log(file);
        var fileModHome = path.join(parentModPath,file,'.modHome')
        var modHome = fs.readFileSync(fileModHome,'utf8')
        modHome = modHome.replace(/\s/g,'')
        var apps = modHome.split(',')
        apps.forEach(function(app){
            mapper[app] = mapper[app] || []
            mapper[app].push(file)
        })


        //console.log(modHome);
    })
    return mapper
}
