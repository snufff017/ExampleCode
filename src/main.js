import Vue from 'vue'
import {store} from './store/store'
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router'
import routes from './router'
import App from './App.vue'

import VModal from 'vue-js-modal'
import VueCookies from 'vue-cookies';


import Editor from '@tinymce/tinymce-vue';


Vue.use(VueCookies);
window.$cookies.config('30d', '/')

Vue.use(VModal);


Vue.config.productionTip = false
Vue.use(VeeValidate);


Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history'
})

// Navigation hook
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.loggedIn) {
            next({
                name: 'login',
            })
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.requiresVisitor)) {
        if (store.getters.loggedIn) {
            next({
                name: 'dashboard',
            })
        } else {
            next()
        }
    } else {
        next()
    }
})


// Create user`s directive
let handleOutsideClick;
Vue.directive('closable', {
    bind (el, binding, vnode) {
        handleOutsideClick = (e) => {
            e.stopPropagation()
            const { handler, exclude } = binding.value
            let clickedOnExcludedEl = false
            exclude.forEach(refName => {
                if (!clickedOnExcludedEl) {
                    const excludedEl = vnode.context.$refs[refName]
                    clickedOnExcludedEl = excludedEl.contains(e.target)
                }
            })
            if (!el.contains(e.target) && !clickedOnExcludedEl) {
                vnode.context[handler]()
            }
        }
        document.addEventListener('click', handleOutsideClick)
        document.addEventListener('touchstart', handleOutsideClick)
    },
    unbind () {
        document.removeEventListener('click', handleOutsideClick)
        document.removeEventListener('touchstart', handleOutsideClick)
    }
});

new Vue({
    render: h => h(App),
    store,
    router: router,
    components: {
        Editor: Editor
    },
}).$mount('#app')