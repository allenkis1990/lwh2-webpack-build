import Vue from 'vue'
import VueMapper from '@center/vueMapper.js'
import App from '@center/App.vue'

const getUrlParam = (key) => {
    let reg = new RegExp('[?|&]' + key + '=([^&]+)')
    let match = location.search.match(reg)
    return match && match[1]
}
// const loader = getUrlParam('loader') || 'xhr'
const page = getUrlParam('page') || 1

/* eslint-disable no-new */

new Vue(Vue.util.extend({
    el: '#app',
    App
}, VueMapper[page]))