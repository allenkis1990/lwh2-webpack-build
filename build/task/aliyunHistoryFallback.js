
let path = require('path')
function distHistoryFallback(req,res,project){
    if(/\./.test(req.url)){
        var reg = /\?.*/
        var url = req.url.replace(reg,'')
        url = decodeURI(url)
        res.sendFile(path.resolve(__dirname,`../${project}${url}`))
    } else {
        res.sendFile(path.resolve(__dirname,`../${project}/index.html`))
    }
}
module.exports = distHistoryFallback
