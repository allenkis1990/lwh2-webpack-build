/**
 * Created by Allen on 2019/2/12.
 */
/**
 * 把asset entry vendor manifest都分配到center或者portal里面去
 * 相应更改生成的index.html引资源的位置
 */
const config = require('../config/config.js')
let env = process.env.NODE_ENV
let developmentReg = /development/
let startObj = {}
config.apps.forEach((app)=>{
    // startObj[app+'Start'] = developmentReg.test(env)?`${app}/`:`/${app}/`
    startObj[app+'Start'] = `/${app}/`
})
// let portalStart = developmentReg.test(env)?'portal/':'/portal/'
// let centerStart = developmentReg.test(env)?'center/':'/center/'

const HtmlWebpackPlugin = require('html-webpack-plugin');
class moveAssetsToDirPlugin{
    //处理manifest和vendor等通用的
    processCommon(itemTag,compilation){
        this.oldAssetFullFile = `js/${this.assetFileName}`
        config.apps.forEach((app,no)=>{
            let outputWhich = startObj[app+'Start'].replace('/','')
            this['assetFileFullName'+no] = `${outputWhich}js/${this.assetFileName}`
            compilation.assets[this['assetFileFullName'+no]] = compilation.assets[this.oldAssetFullFile]
            if (compilation.assets[this.oldAssetFullFile + '.map']) {
                compilation.assets[this['assetFileFullName'+no] + '.map'] = compilation.assets[this.oldAssetFullFile + '.map']
            }
        })
        itemTag.attributes.src = `$$$$dir$$$$js/${this.assetFileName}${this.hash}`
    }
    //处理assets下的文件
    processAssets(dir,itemTag,compilation,which){
        this.oldAssetFullFile = `js/${dir}/${this.assetFileName}`
        this.assetFileFullName = `${which}js/${this.assetFileName}`
        let outputWhich = this.assetFileFullName.replace('/','')
        itemTag.attributes.src = this.assetFileFullName+this.hash
        compilation.assets[outputWhich] = compilation.assets[this.oldAssetFullFile]
        if(compilation.assets[this.oldAssetFullFile+'.map']){
            compilation.assets[outputWhich+'.map'] = compilation.assets[this.oldAssetFullFile+'.map']
            delete compilation.assets[this.oldAssetFullFile+'.map']
        }
        if(compilation.assets[this.oldAssetFullFile]){
            delete compilation.assets[this.oldAssetFullFile]
        }
    }
    //处理入口文件
    processEntry(dir,itemTag,compilation){
        this.oldAssetFullFile = `js/${this.assetFileName}`
        this.assetFileFullName = `${dir}js/${this.assetFileName}`
        let outputWhich = this.assetFileFullName.replace('/','')
        itemTag.attributes.src = this.assetFileFullName + this.hash
        compilation.assets[outputWhich] = compilation.assets[this.oldAssetFullFile]
        if (compilation.assets[this.oldAssetFullFile + '.map']) {
            compilation.assets[outputWhich + '.map'] = compilation.assets[this.oldAssetFullFile + '.map']
            delete compilation.assets[this.oldAssetFullFile + '.map']
        }
        if(compilation.assets[this.oldAssetFullFile]){
            delete compilation.assets[this.oldAssetFullFile]
        }
    }
    apply(compiler){
        compiler.hooks.compilation.tap('moveAssetsToDirPlugin',(compilation)=>{
            let appRegs = {}
            config.apps.forEach((app)=>{
                appRegs[app+'Reg1'] = new RegExp(`[\\\\/]${app}[\\\\/]`)
                appRegs[app+'Reg2'] = new RegExp(`[\\\\/]${app}\\.`)
            })
            // let portalReg1 = /([\\/]portal[\\/])/
            // let portalReg2 = /([\\/]portal\.)/
            // let centerReg1 = /([\\/]center[\\/])/
            // let centerReg2 = /([\\/]center\.)/
            let vendorReg = /([\\/]vendor\.)/
            let manifestReg = /([\\/]manifest\.)/
            let hotUpdateReg = /hot-update/
            this.HtmlWebpackPluginCount = 0
            this.vendorLoadObj = {count:0}
            this.maniFestLoadObj = {count:0}
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
                'alterAssetTagGroups',
                (data, cb) => {
                    //Object.keys(compilation.assets).forEach((itemAsset)=>{
                    //    console.log(itemAsset);
                    //})
                    //console.log(222222222);
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
                        config.apps.forEach((app)=>{
                            // appRegs[app+'Reg1'] = new RegExp(`[\\\\/]${app}[\\\\/]`)
                            // appRegs[app+'Reg2'] = new RegExp(`[\\\\/]portal\\.`)
                            if(appRegs[app+'Reg1'].test(src)){
                                this.processAssets(app,itemTag,compilation,`${startObj[app+'Start']}`)
                                // console.log(this.assetFileFullName,123);
                            }
                            //hotUpdate文件不需要处理
                            if(appRegs[app+'Reg2'].test(src)&&!hotUpdateReg.test(src)){
                                this.processEntry(`${startObj[app+'Start']}`,itemTag,compilation)
                                // console.log(this.assetFileFullName,123);
                            }
                        })
                        //hotUpdate文件不需要处理
                        if(vendorReg.test(src)&&!hotUpdateReg.test(src)){
                            //console.log(222222);
                            //this.oldAssetFullFile = `js/${this.assetFileName}`
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
                    // replace('portal',`${portalStart}`)
                    // replace('center',`${centerStart}`)
                    cb(null, data)
                }
            )
        })
    }
}
module.exports = moveAssetsToDirPlugin