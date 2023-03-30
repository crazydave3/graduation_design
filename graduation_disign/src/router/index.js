import Vue from 'vue'
import VueRouter from 'vue-router'

import Monitor from '../components/Monitor'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/monitor'
    },
    {
        path: '/monitor',
        component: Monitor,
        meta: {
            isShow: true
        }
    },
]

const router = new VueRouter({
    routes
})

export default router