/**
 * Created by admin on 2019/2/17.
 */

const rimraf = require('rimraf');
let vueMapper = require('./vueMapper')
module.exports = function(config){
    rimraf(config.dist, function (err) {
        if(err){
            console.log(err);
        } else {
            if(config.isDesign){
                vueMapper(config.mainDir,config.project)
            }
        }
    });
}