
###  运行npm install安装工程依赖
###  config文件夹下config.js为项目配置文件可以更改host port

###  vue项目开发环境：
###(1) vue项目开发主要文件夹为projects文件夹，底下的子文件夹为每个子项目（project1,project2）
###(2) 当子项目中依赖的文件找不到会去parentProject这个母版文件夹下去找
###(3) 运行npm run dev会默认运行projects文件夹下的第一个子项目 npm run dev -- --project=project2(子项目文件夹名)可以指定运行项目
###(4) 浏览器输入默认开发环境地址127.0.0.1:8080

###  静态页面开发环境：
###(1) 静态页面开发主要文件夹为design文件夹，底下的子文件夹为每个子项目（project1,project2）
###(2) 当子项目中依赖的文件找不到会去designParent这个母版文件夹下去找
###(3) 运行npm run design会默认运行design文件夹下的第一个子项目 npm run design -- --project=project2(子项目文件夹名)可以指定运行项目
###(4) 浏览器输入默认静态页开发环境地址127.0.0.1:8181 如果要访问portal下的test1.vue那么就是输入127.0.0.1:8181/portal/?page=test1


###  打包
###(1) npm run pro默认打包projects下的第一个子项目,npm run pro -- --project=project2打包指定子项目
###(2) npm run build 打包projects下的所有子项目
###(3) dist文件夹下是打包后的代码

### 运行压缩后的代码
npm run dev:dist 详情见pro-server.js
