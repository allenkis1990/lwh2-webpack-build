//拦截器
import axios from 'axios'
import { Message } from 'element-ui'
axios.interceptors.request.use(function (request) {
    let dateHsh = /\?/ig.test(request.url) ? '&' : '?'
    request.url += `${dateHsh}_q_='${new Date().getTime()}`
    return request;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    if (error.response) {
        if (error.response.status === 404) {
            Message({
                message:'请求404',
                type:'error'
            })
            console.log(Message);
            console.error('请求404!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            return;
        }
        if (error.response.status === 401) {
            console.error('还没登陆!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            return;
        }
        if (error.response.status === 500) {
            console.error('服务器出错!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            return;
        }
    }
    return Promise.reject(error);
});
