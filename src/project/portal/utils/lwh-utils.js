/**
 * Created by Allen Liu on 2019/7/20.
 */


export function lwhAnimate(ele,options,callBack,ingFn,beishu){
    function doSpecFn(styleName,n){
        if(styleName==='scrollTop'){
            return function(){
                var html = document.documentElement
                var body = document.body
                html[styleName] = n
                body[styleName] = n
            }
        }else{
            return false
        }
    }
    Object.keys(options).forEach(function(styleName,i){
        ele['animateId'+i] = requestAnimationFrame(function(time){
            move(time,ele['animateId'+i],function(ele){
                callBack&&callBack(ele)
            })
        })
        var trueStyles = window.getComputedStyle(ele)
        var initNum = 0
        var initBei = 1
        if(styleName==='opacity'){
            initBei = 1000
            initNum = 1
        }
        if(styleName==='scrollTop'){
            initNum = document.documentElement.scrollTop || document.body.scrollTop
        }
        // debugger
        var initLocation = parseFloat(trueStyles[styleName]?trueStyles[styleName]:initNum)*initBei
        var fallyLocation = parseFloat(options[styleName])*initBei
        // debugger
//            console.log(initLocation);
//            console.log(fallyLocation);
        var danwei = isNaN(Number(options[styleName]))?(options[styleName].replace(/\d+/,'').replace('-','')):''
        var distant = 0
        function move(time,animateId,cb){
            distant++
            if(initLocation>fallyLocation){
                initLocation -= distant * (beishu || 1)
                var a = (initLocation/initBei)<=fallyLocation?fallyLocation:(initLocation/initBei)
                var n = danwei? a+danwei : a
                var spec = doSpecFn(styleName,n)
                if(spec){
                    spec()
                }else{
                    ele.style[styleName] =n
                }
                ingFn && ingFn(ele,animateId)
                if(initLocation>fallyLocation){
                    animateId = requestAnimationFrame(function(){
                        move(time,animateId,cb)
                    })
                }else{
                    cancelAnimationFrame(animateId)
                    cb(ele)
                }
            }else{
                initLocation += distant * (beishu || 1)
                var a = (initLocation/initBei)>=fallyLocation?fallyLocation:(initLocation/initBei)
                var n = danwei? a+danwei : a
                var spec = doSpecFn(styleName,n)
                if(spec){
                    spec()
                }else{
                    ele.style[styleName] =n
                }
                ingFn && ingFn(ele,animateId)
                if(initLocation<fallyLocation){
                    animateId = requestAnimationFrame(function(){
                        move(time,animateId,cb)
                    })
                }else{
                    cb(ele)
                    cancelAnimationFrame(animateId)
                }
            }
        }
    })
}

export function offset(obj, direction) {
    // if(!obj){
    //     return false
    // }
    //将top,left首字母大写,并拼接成offsetTop,offsetLeft
    var offsetDir = 'offset' + direction[0].toUpperCase() + direction.substring(1);

    var realNum = obj[offsetDir];
    var positionParent = obj.offsetParent;  //获取上一级定位元素对象

    while (positionParent != null) {
        realNum += positionParent[offsetDir];
        positionParent = positionParent.offsetParent;
    }
    return realNum;
}

export function addClass(selectorStr,className){
    var nodes = document.querySelectorAll(selectorStr)
    Array.from(nodes).forEach(function(node){
        var classStr = node.getAttribute('class')
        var resClassStr = ''
        if(!classStr){
            resClassStr = className
        }else{
            resClassStr = classStr+' ' +className
        }
        node.setAttribute('class',resClassStr)
    })
}

export function isMobile(){
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid || ipad;
    return isMobile
}


export function imgAutoSize(Img, maxWidth, maxHeight,cb){
    var image = new Image();
    //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
    image.onload=function(){
//            console.log(image.width);
//            console.log(image.height);
        // 当图片比图片框小时不做任何改变
        if (image.width < maxWidth&& image.height < maxHeight) {
            Img.setAttribute('width',image.width)
            Img.setAttribute('height',image.height)
        }
        else //原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
        {
            if (maxWidth/ maxHeight  <= image.width / image.height) //原图片宽高比例 大于 图片框宽高比例
            {
                // Img.width = maxWidth;   //以框的宽度为标准
                // Img.height = maxWidth* (image.height / image.width);
                Img.setAttribute('width',maxWidth)
                Img.setAttribute('height',maxWidth* (image.height / image.width))
            }
            else {   //原图片宽高比例 小于 图片框宽高比例

                Img.setAttribute('width',maxHeight  * (image.width / image.height))
                Img.setAttribute('height',maxHeight)
            }
        }

        //如果生成出来的宽高小于最大宽度和最大高度，那就居中
        var w = Img.getAttribute('width')
        var H = Img.getAttribute('height')

        cb && cb(w,H)
    }
    image.src = Img.getAttribute('src');
}

export function setCookie(key,value){
    localStorage.setItem(key,value)
}

export function getCookie(key){
    return localStorage.getItem(key)
}