import Vue from 'vue'
import VueRouter from 'vue-router'

import Monitor from '../views/Monitor'
import Register from '../views/Register'
import Identify from '../views/Identify'
import Count from '../views/Count'
import Login from '../views/Login'
import Home from '../views/Home'
//引入二级路由组件
import Admin from '../views/Home/Admin'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login,
        meta: {
            isShow: true
        }
    },
    {
        path: '/home',
        component: Home,
        meta: {
            isShow: true
        },
        children: [{
                path: 'admin',
                component: Admin,
            },

            {
                path: '/home',
                redirect: '/home/admin'
            }
        ],
    },
    {
        path: '/monitor',
        component: Monitor,
        meta: {
            isShow: true
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
            isShow: true
        }
    },
    {
        path: '/identify',
        component: Identify,
        meta: {
            isShow: true
        }
    },
    {
        path: '/count',
        component: Count,
        meta: {
            isShow: true
        }
    }
]

const router = new VueRouter({
    routes
})

export default router