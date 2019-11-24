###  vue工程脚手架  作者Allen Liu github主页：https://github.com/allenkis1990/lwh2-webpack-build

###  主要功能点
###  (1):拉取node_modules文件下名为@liuweiheng19906666的包下的模块到src文件夹下的parentMods文件夹，作为项目里的复用代码
###  (2):如果需要修改@parentMods里的文件，差异化再mods文件夹下做，文件结构要和parentMods相同，mods下的文件会覆盖parentMods
###  (3):每个模块都包含router,component,store,style,views,这些模块都是独立工程开发并且发布成npm包
###  (4):每个模块里都有一个.modHome的文件用来区分哪个app需要引用模块
###  (5):主要开发代码在src的project文件夹里做，并且可以使用mods下的所有component，store，router
###  (6):静态页面开发目录是design目录

###   npm命令
###   (1):npm run dev运行开发环境
###   (2):npm run design运行静态页面开发环境
###   (3):npm run build打包生成dist代码
###   (4):npm run build:dist:打包生成dist代码(如果需要把dist代码放本地跑起来需要用这个打包)
###   (5):npm run dev:dist运行dist文件夹下的代码
###   (6):npm run copyMods运行npm install并且从node_modules下的@liuweiheng19906666文件夹下拉包



