/**
 * Created by Allen Liu on 2019/11/23.
 */
let fileCopy = require('copy-dir')
let path = require('path')
let colors = require('colors/safe');
let fs = require('fs')
let rimraf = require('rimraf');


var parentModPath = path.resolve(__dirname, '..', '..', 'src/parentMods')
var packagePath = path.resolve(__dirname, '..', '..', 'node_modules/@liuweiheng19906666')


rmAsync(parentModPath).then(function(){
    fs.readdir(packagePath, function (e, files) {
        if (e) {
            console.log(e);
            return
        }
        //console.log(files);
        files.forEach(function (file) {
            var target = path.join(packagePath, file, 'src/mods')
            var dest = parentModPath
            fileCopy.sync(target, dest)
            //把最外层的modHome copy到具体的parentMods的各个包里 用来区这个模块会被portal还是center引用
            var targetModHome = path.join(packagePath, file, '.modHome')
            var destModHome = path.join(parentModPath,`@${file}`,'.modHome')
            fileCopy.sync(targetModHome, destModHome)
        })
    })
})



function rmAsync(target){
    return new Promise(function(resolve,reject){
        rimraf(target, function (err) {
            if(err){
                console.log(colors.red(`删除路径${target}失败!!!`))
                reject()
            } else {
                console.log(colors.green(`删除路径${target}成功`))
                resolve()
            }
        });
    })
}