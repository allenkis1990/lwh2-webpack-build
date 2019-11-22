

let config = require('../config/config.js')
let path = require('path')
function distHistoryFallback(req,res,project){
    var appRegStr = '('
    appRegStr += (config.apps+'').replace(',','|')
    appRegStr += ')'
    //console.log(appRegStr);
    let homeReg
    let otherPagesReg
    //匹配/portal
    homeReg = new RegExp(`^\\/${appRegStr}\\/?$`)
    //匹配/portal/xxxx或者/portal/xxxx.ext
    otherPagesReg = new RegExp(`\\/${appRegStr}\\/.+$`)


    //console.log('测试结果:'+homeReg.test(req.url))
    //console.log('地址:'+req.url)

    //console.log('测试结果:'+otherPagesReg.test(req.url))
    //console.log('地址:'+req.url)



    if(/\./.test(req.url)){
        var reg = /\?.*/
        var url = req.url.replace(reg,'')
        url = decodeURI(url)
        res.sendFile(path.resolve(__dirname,`../${project}${url}`))
    } else {
        if(config.apps.length>1){
            if(otherPagesReg.test(req.url)){
                var match = req.url.match(otherPagesReg)
                var app = match?(match.length>0?match[1]:''):'';
                res.sendFile(path.resolve(__dirname,`../${project}/${app}/index.html`))
            }
            if(homeReg.test(req.url)){
                var match = req.url.match(homeReg)
                var app = match?(match.length>0?match[1]:''):'';
                //console.log(app);
                res.sendFile(path.resolve(__dirname,`../${project}/${app}/index.html`))
            }
        }else{
            res.sendFile(path.resolve(__dirname,`../${project}/index.html`))
        }
    }
}
module.exports = distHistoryFallback
