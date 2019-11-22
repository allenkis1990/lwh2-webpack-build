var fs = require('fs')
var path = require('path')
class addFavIcoPlugin{
    constructor(options){

    }
    apply(compiler){
        var _this = this
        var favIcoContent = fs.readFileSync(path.resolve(__dirname,'../../favicon.ico'))
        compiler.hooks.emit.tapAsync('addFavIcoPlugin',(compilation,cb)=>{
            compilation.assets['favicon.ico']={
                source(){
                    return favIcoContent
                },
                size(){
                    //获取字符串长度可把中文拆成字节
                    return Buffer.byteLength(favIcoContent)
                }
            }
            cb()

        })
    }
}
module.exports = addFavIcoPlugin