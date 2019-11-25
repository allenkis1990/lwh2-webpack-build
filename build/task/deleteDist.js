/**
 * Created by admin on 2019/2/17.
 */

const rimraf = require('rimraf');
let vueMapper = require('./vueMapper')
let argv = require('yargs').argv
const config = require('../config/config.js')
module.exports = function(){
    if(!argv.devdist){
        deleteDist()
    }else{
        if(argv.mode==='production'){
            deleteDist()
        }
    }
    function deleteDist(){
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
}