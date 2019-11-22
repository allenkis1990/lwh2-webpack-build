/**
 * Created by Allen on 2019/2/12.
 */
/**
 * 把vendor manifest都分配到center或者portal里面去
 * 相应更改生成的index.html引资源的位置
 */
const config = require('../config/config.js')
let env = process.env.NODE_ENV
let developmentReg = /development/
let startObj = {}
config.apps.forEach((app)=>{
    startObj[app+'Start'] = `/${app}/`
})


const HtmlWebpackPlugin = require('html-webpack-plugin');
class moveAssetsToDirPlugin{
    //处理manifest和vendor等通用的
    processCommon(itemTag,compilation){
        this.oldAssetFullFile = `${this.assetFileName}`
        config.apps.forEach((app,no)=>{
            let outputWhich = startObj[app+'Start'].replace('/','')
            this['assetFileFullName'+no] = `${outputWhich}${this.assetFileName}`
            compilation.assets[this['assetFileFullName'+no]] = compilation.assets[this.oldAssetFullFile]
            if (compilation.assets[this.oldAssetFullFile + '.map']) {
                compilation.assets[this['assetFileFullName'+no] + '.map'] = compilation.assets[this.oldAssetFullFile + '.map']
            }
        })
        itemTag.attributes.src = `$$$$dir$$$$${this.assetFileName}${this.hash}`
    }
    apply(compiler){
        compiler.hooks.compilation.tap('moveAssetsToDirPlugin',(compilation)=>{
            let appRegs = {}
            config.apps.forEach((app)=>{
                appRegs[app+'Reg1'] = new RegExp(`[\\\\/]${app}[\\\\/]`)
                appRegs[app+'Reg2'] = new RegExp(`[\\\\/]${app}\\.`)
            })
            let vendorReg = /([\\/]vendor\.)/
            let manifestReg = /([\\/]manifest\.)/
            let hotUpdateReg = /hot-update/
            this.HtmlWebpackPluginCount = 0
            this.vendorLoadObj = {count:0}
            this.maniFestLoadObj = {count:0}
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
                'alterAssetTagGroups',
                (data, cb) => {
                    this.HtmlWebpackPluginCount++
                    // console.log(this.HtmlWebpackPluginCount);
                    data.bodyTags.forEach((itemTag)=>{
                        // console.log(itemTag);
                        let tagSrcReg = /.+\?(.+)/
                        let src = itemTag.attributes.src
                        // console.log(src,this.HtmlWebpackPluginCount);
                        let beforeHashSrc = itemTag.attributes.src.replace(/\?(.+)/,'')
                        this.hash = src.match(tagSrcReg)?'?'+src.match(tagSrcReg)[1]:''
                        // console.log(hash);
                        this.assetFileName = beforeHashSrc.split('/').pop()
                        //let assetFileFullName,oldAssetFullFile,assetFileFullName1,assetFileFullName2
                        //hotUpdate文件不需要处理
                        if(vendorReg.test(src)&&!hotUpdateReg.test(src)){
                            this.processCommon(itemTag,compilation)
                            this.vendorLoadObj.fullFile = this.oldAssetFullFile
                            this.vendorLoadObj.count ++
                        }
                        //hotUpdate文件不需要处理
                        if(manifestReg.test(src)&&!hotUpdateReg.test(src)){
                            this.processCommon(itemTag,compilation)
                            this.maniFestLoadObj.fullFile = this.oldAssetFullFile
                            this.maniFestLoadObj.count ++
                        }
                    })
                    //console.log(this.vendorLoadObj.count,'vvvvv');
                    //console.log(this.maniFestLoadObj.count,'mmmmm');
                    //如果是common的文件要等最后才能删不能用过第一次就删掉
                    if (this.HtmlWebpackPluginCount===2&&(this.vendorLoadObj.count===1||this.vendorLoadObj.count===2)) {
                        // console.log(this.vendorLoadObj.count,'vvvvv');
                        if(compilation.assets[this.vendorLoadObj.fullFile]){
                            delete compilation.assets[this.vendorLoadObj.fullFile]
                        }
                        if (compilation.assets[this.vendorLoadObj.fullFile+'.map']) {
                            delete compilation.assets[this.vendorLoadObj.fullFile+'.map']
                        }
                    }
                    if (this.HtmlWebpackPluginCount===2&&this.maniFestLoadObj.count===2) {
                        // console.log(this.maniFestLoadObj.count,'mmmmm');
                        if(compilation.assets[this.maniFestLoadObj.fullFile]){
                            delete compilation.assets[this.maniFestLoadObj.fullFile]
                        }
                        if (compilation.assets[this.maniFestLoadObj.fullFile+'.map']) {
                            delete compilation.assets[this.maniFestLoadObj.fullFile+'.map']
                        }
                    }
                    cb(null, data)
                }
            )
            // beforeEmit
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                'beforeEmit',
                (data, cb) => {
                    function replace(regStr,which){
                        let reg = new RegExp(regStr,'img')
                        if(reg.test(data.plugin.options.filename)){
                            // console.log(data.html);
                            data.html = data.html.replace(/\$\$\$\$dir\$\$\$\$/ig,which)
                        }
                    }
                    config.apps.forEach((app)=>{
                        replace(app,`${startObj[app+'Start']}`)
                    })
                    cb(null, data)
                }
            )
        })
    }
}
module.exports = moveAssetsToDirPlugin