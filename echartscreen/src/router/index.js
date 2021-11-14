import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sellerPage',
    name: 'SellerPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/SellerPage.vue')
  },
  {
    path: '/rankPage',
    name: 'RankPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/RankPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
