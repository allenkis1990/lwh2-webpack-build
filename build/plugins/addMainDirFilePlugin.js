/**
 * Created by allen on 2019/2/12.
 * 当原来mainDir的文件被删除的时候会去找parent的
 * 当mainDir被删除的文件被恢复回来就重新引用自己的resource 但是要手动改变一个JS触发重新编译才生效
 */
let config = require('../config/config.js')
let fs = require('fs')
let chokidar = require('chokidar')
let path = require('path')
class addMainDirFilePlugin{
    constructor(options){
        this.mainDir = options.mainDir.replace('../','')
        this.parentDir = options.parentDir.replace('../','')
    }
    findModule(path,modules){
        let module = modules.find((m,i)=>{
            return path===m.userRequest
        })
        return module
    }
    apply(compiler){
        var _this = this
        let watcher = chokidar.watch('../', {
            persistent: true,
            ignoreInitial:true,
            cwd: path.resolve(path.resolve(__dirname,'..','..',_this.mainDir,config.project))
        })
        compiler.hooks.compilation.tap('compilation',(compilation)=>{
            //console.log(compilation.modules);
            if(!this.watching){
                //原来被删除的文件又恢复了
                watcher.on('add',(url)=>{
                    // console.log(url,'新增');
                    let basePath = path.resolve(__dirname,'..','..',_this.mainDir,config.project)
                    let addFullPath = `${basePath}${path.sep}${url}`
                    let module = this.findModule(addFullPath,compilation.modules)
                    //console.log(moduleIndex,'index')
                    if(module){
                        // console.log(addFullPath,1111);
                        // console.log(module.userRequest,'u');
                        // console.log(module.resource,'r');
                        module.resource = addFullPath
                        // console.log(module.resource,'h');
                        //compilation.modules[moduleIndex].resource = addFullPath
                        //console.log(compilation.modules[moduleIndex].resource);
                    }
                })
                this.watching = true
            }

            //原来有的文件被删除了 就去parent里找
            compilation.hooks.buildModule.tap('NotFoundPlugin', (module) => {
                let mainDir = this.mainDir,parentDir = this.parentDir
                if (module.resource && new RegExp(`\\\\${mainDir}\\\\`).test(module.resource)
                    && !new RegExp(`node_modules`).test(module.resource)) {
                    if(!fs.existsSync(module.resource)&&!(/\.vue\?.+/.test(module.resource))){
                        // console.log(1010101);
                        module.resource = module.resource.replace(`${mainDir}${path.sep}${config.project}`,parentDir)
                        // console.log(module.resource,6666);
                    }
                }
            })
        })
    }
}
module.exports = addMainDirFilePlugin