/**
 * Created by allen on 2019/3/10.
 * 自动生成vueMapper import home from home.vue home取得是文件的名字
 * 先读取当前项目的views文件夹(没有的话就是空数组)然后再concat上parent的views文件夹 最后进行去重
 */
let fs = require('fs')
let path = require('path')
module.exports = function(designDir,project){
    let baseDir =  path.resolve(__dirname,'..','..',`${designDir.replace('../','')}/${project}`)
    fs.readdir(baseDir,(err,apps)=>{
        if(err){
            console.log(err);
        } else {
            //console.log(apps,121212);
            apps.forEach((app)=>{
                let appPath = path.join(baseDir,app)

                let views
                fs.readdir(`${appPath}/views`,(e,arr)=>{
                    if(e){
                        views = []
                    } else {
                        views = arr
                    }

                    views = views.reduce((pre, next) => {
                        pre.indexOf(next) === -1 && pre.push(next)
                        return pre
                    }, [])
                    console.log(views,project+'-'+app);
                    let vueMapperContent = ''
                    let exportContent = 'export default { '
                    views.forEach((view,index)=>{
                        if(/\.vue$/.test(view)){
                            let viewName = view.replace('.vue','')
                            vueMapperContent += `import ${viewName} from '@${app}/views/${view}';`
                            exportContent += `${viewName}${index===views.length-1?'':','}`
                        }
                    })
                    exportContent += ` }`
                    vueMapperContent +=  `\n${exportContent}`
                    //console.log(vueMapperContent,111222);
                    fs.writeFileSync(path.join(appPath,'vueMapper.js'),vueMapperContent)
                })
            })
        }
    })
}
