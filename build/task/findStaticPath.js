/**
 * Created by Allen on 2019/2/12.
 * 设置静态资源地址 如果找不到地址去parent拿
 */
let config = require('../config/config.js')
let path = require('path')
const {existsSync} = require('fs')
function findStaticPath(requestUrl){
    return function(req,res){
        let mainDir = config.mainDir.replace('./','')
        let parentDir = config.parentMainDir.replace('./','')
        let project = config.project
        let fullRequest = path.resolve(__dirname,`../${mainDir}/${project}${requestUrl}${req.url}`)
        let isExist = existsSync(fullRequest)
        // console.log(isExist,8888);
        if(isExist){
            res.sendFile(fullRequest)
        } else {
            let fullParentRequest = path.resolve(__dirname,`../${parentDir}${requestUrl}${req.url}`)
            res.sendFile(fullParentRequest)
        }

    }
}
module.exports = findStaticPath
