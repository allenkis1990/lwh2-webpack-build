/**
 * Created by Allen on 2019/2/12.
 */
const config = require('../config/config.js')
class processChunkPlugin{
    apply(compiler){
        compiler.hooks.emit.tapAsync('processChunkPlugin',(compilation,cb)=>{
            let regStr = '('
            let len = config.apps.length-1
            config.apps.forEach((app,index)=>{
                regStr+=index===len?`${app}Chunk@)`:`${app}Chunk@|`
            })
            let reg = new RegExp(regStr)
            // console.log(reg);
            Object.keys(compilation.assets).forEach((key)=>{
                let matchs = key.match(reg)
                if(matchs&&matchs.length){
                    // console.log('url:'+key);
                    let appName = matchs[0].replace('Chunk@','')
                    let fileName = key.split('@')[1]
                    // console.log(appName,fileName);
                    compilation.assets[`${appName}/js/chunk/${fileName}`] = compilation.assets[key]
                    delete compilation.assets[key]
                }
            })
            cb()
        })


        // compiler.hooks.compilation.tap('xx',(compilation)=>{
        //     compilation.hooks.optimizeTree.tap('aa',(c,m)=>{
        //         console.log(m);
        //     })
        // })
    }
}
module.exports = processChunkPlugin