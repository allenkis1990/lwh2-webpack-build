/**
 * Created by Allen on 2019/2/12.
 * 纠正vue-router history模式下刷新后出现404问题
 */
let history = require('connect-history-api-fallback')
let config = require('../config/config.js')
function historyFallback(app){
    let rewrites = []
    config.apps.forEach((app)=>{
        //匹配/portal
        let homeReg = new RegExp(`^\\/${app}$`)
        //匹配/portal/xxxx或者/portal/xxxx.ext
        let otherPagesReg = new RegExp(`\\/${app}\\/.+$`)
        rewrites.push({
            from:homeReg,
            to:function(){
                return `/${app}`
            }
        })
        rewrites.push({
            from:otherPagesReg,
            to:function(context){
                if(!/\..+/.test(context.parsedUrl.pathname)){
                    // console.log(context.parsedUrl.pathname)
                    return `/${app}`;
                } else {
                    return context.parsedUrl.pathname
                }
            }
        })
    })
    app.use(history({
        //index:'/portal'
        rewrites: rewrites
    }))
}
module.exports = historyFallback
