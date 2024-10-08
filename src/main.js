// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import router from './route/route';
import store from './store/store';

console.log('vue version: ' + Vue.version);
console.log(process.env.NODE_ENV);
console.log(process.env.ENV_CONFIG);

/**
 * @description 全局 css
 * */
import './assets/scss/app.scss';

/**
 * @description 自定义 vm 实例
 * */
import vm from './vm.vue';

Vue.vm = Vue.prototype.vm = vm;

/**
 * @description 全局 mixin
 * */
const __mixins = () => import('./mixins/__mixins');

/**
 * @description 全局 filter
 * */
import * as globalFilter from './filter/global.filter';

Object.keys(globalFilter).forEach(key => {
  Vue.filter(key, globalFilter[key]);
});
/**
 * @description 全局权限指令
 * */
import permissionDirective from './directive/permission.directive';

Vue.use(permissionDirective);

/**
 * @description element-ui
 * @doc https://element.eleme.cn/
 * */
const elementUI = () => import('./element-ui/element-ui');

/**
 * @description fort awesome 字体
 * @doc https://fontawesome.com/
 * */
const fontAwesome = () => import('./font-awesome/font-awesome');

/**
 * @description 全局组件
 * */
const globalComponents = () => import('./components/global.components');
/**
 * @description 服务组件
 * */
const serviceComponents = () => import('./components/service.components');

const App = () => import('./views/App');

/**
 * @description 复制插件
 * @doc https://github.com/Inndy/vue-clipboard2#readme
 * */
import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);


Vue.config.productionTip = false;


;(async () => {

  let {default: __mixinsInstall} = await __mixins();
  let {default: elementUIInstall} = await elementUI();
  let {default: fontAwesomeInstall} = await fontAwesome();
  let {default: globalComponentsInstall} = await globalComponents();
  let {default: serviceComponentsInstall} = await serviceComponents();


  Vue.mixin(__mixinsInstall);
  elementUIInstall(Vue);
  fontAwesomeInstall(Vue);
  globalComponentsInstall(Vue);
  serviceComponentsInstall(Vue);

  new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
  });

})();


// 引入axios和配置  
const API_BASE_URL = 'http://localhost:7777'; 
Vue.prototype.$API_BASE_URL = API_BASE_URL;  

